// Base Agent Implementation
import llmService, { LLMMessage } from '../ai/llm-service';
import { spawn } from 'child_process';

/**
 * Base Agent Architecture
 * All specialized agents (Claims, Policy, Support, Compliance) extend this
 */

export interface AgentContext {
    conversationId: string;
    userId?: string;
    language: 'en' | 'ar' | 'both';
    metadata?: Record<string, any>;
}

export interface AgentMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export interface AgentTool {
    name: string;
    description: string;
    parameters: Record<string, any>;
    execute: (params: any, context: AgentContext) => Promise<any>;
}

export interface AgentResponse {
    message: string;
    reasoning?: string;
    requiresAction?: {
        type: string;
        data: any;
    };
    suggestedNext?: string[];
    confidence?: number;
    metadata?: {
        usage?: {
            totalTokens: number;
        };
        [key: string]: any;
    };
}



export class BaseAgent {
    protected name: string;
    protected description: string;
    protected systemPrompt: string;
    protected notebookId?: string;
    protected tools: Map<string, AgentTool>;
    protected conversations: Map<string, AgentMessage[]>;

    constructor(name: string, description: string, systemPrompt: string, notebookId?: string) {
        this.name = name;
        this.description = description;
        this.systemPrompt = systemPrompt;
        this.notebookId = notebookId;
        this.tools = new Map();
        this.conversations = new Map();
    }

    /**
     * Query NotebookLM for insights
     */
    protected async queryNotebookLM(query: string, context: AgentContext): Promise<string | null> {
        if (!this.notebookId) return null;

        const trySpawn = (command: string): Promise<string | null> => {
            return new Promise((resolve) => {
                try {
                    console.log(`Attempting NotebookLM bridge via ${command}...`);
                    const pythonProcess = spawn(command, [
                        'scripts/notebooklm_bridge.py',
                        this.notebookId!,
                        query
                    ]);

                    let output = '';
                    let errorOutput = '';

                    pythonProcess.stdout.on('data', (data: Buffer) => {
                        output += data.toString();
                    });

                    pythonProcess.stderr.on('data', (data: Buffer) => {
                        errorOutput += data.toString();
                    });

                    pythonProcess.on('error', (err: any) => {
                        console.error(`Failed to start ${command} process:`, err.message);
                        resolve(null);
                    });

                    // Safety timeout (15s)
                    const timeout = setTimeout(() => {
                        console.warn(`${command} bridge timed out after 15s`);
                        pythonProcess.kill();
                        resolve(null);
                    }, 15000);

                    pythonProcess.on('close', (code: number) => {
                        clearTimeout(timeout);
                        if (code !== 0) {
                            console.error(`${command} Bridge error (exit code ${code}): ${errorOutput}`);
                            resolve(null);
                            return;
                        }

                        try {
                            const result = JSON.parse(output);
                            if (result.status === 'success') {
                                resolve(result.answer);
                            } else {
                                console.error(`${command} Bridge returned error:`, result.error);
                                resolve(null);
                            }
                        } catch (e) {
                            console.error(`Failed to parse ${command} Bridge output:`, e);
                            resolve(null);
                        }
                    });
                } catch (e) {
                    console.error(`Exception during ${command} spawn:`, e);
                    resolve(null);
                }
            });
        };

        // Try 'python' first, then 'python3' as fallback
        let result = await trySpawn('python');
        if (!result) {
            console.log('Falling back to python3...');
            result = await trySpawn('python3');
        }

        if (!result) {
            console.warn('NotebookLM bridge unavailable (Python/Modules not found). Falling back to LLM base knowledge.');
        }

        return result;
    }

    /**
     * Register a tool for this agent
     */
    protected registerTool(tool: AgentTool): void {
        this.tools.set(tool.name, tool);
    }

    /**
     * Get conversation history
     */
    protected getConversationHistory(conversationId: string): AgentMessage[] {
        if (!this.conversations.has(conversationId)) {
            this.conversations.set(conversationId, []);
        }
        return this.conversations.get(conversationId)!;
    }

    /**
     * Add message to conversation
     */
    protected addToConversation(
        conversationId: string,
        message: AgentMessage
    ): void {
        const history = this.getConversationHistory(conversationId);
        history.push(message);

        // Keep only last 20 messages to avoid context overflow
        if (history.length > 20) {
            this.conversations.set(conversationId, history.slice(-20));
        }
    }

    /**
     * Convert agent messages to LLM messages
     */
    protected toLLMMessages(messages: AgentMessage[]): LLMMessage[] {
        return messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
        }));
    }

    /**
     * Main chat interface for the agent
     */
    async chat(
        userMessage: string,
        context: AgentContext
    ): Promise<AgentResponse> {
        try {
            // Add user message to history
            this.addToConversation(context.conversationId, {
                role: 'user',
                content: userMessage,
                timestamp: new Date(),
            });

            // Get conversation history
            const history = this.getConversationHistory(context.conversationId);

            // Check if user is requesting a tool
            const toolRequest = await this.detectToolRequest(userMessage, context);

            if (toolRequest) {
                // Execute tool and return result
                return await this.executeTool(toolRequest.toolName, toolRequest.params, context);
            }

            // Fetch NotebookLM insights if available
            let notebookInsights = '';
            if (this.notebookId) {
                const insights = await this.queryNotebookLM(userMessage, context);
                if (insights) {
                    notebookInsights = `\n\n### SOVEREIGN KNOWLEDGE BASE INSIGHTS\n${insights}\n\nUse the above insights to answer the user's query accurately, citing sources if mentioned.`;
                }
            }

            // Generate response using LLM
            const llmMessages = this.toLLMMessages(history);
            const reasoningPrompt = "\n\nIMPORTANT: Respond in valid JSON format only with two fields: 'message' (your response to the user) and 'reasoning' (a brief explanation of the logic, rules, or data sources you used to arrive at this answer).";

            const response = await llmService.chat(llmMessages, {
                systemPrompt: this.buildSystemPrompt(context) + notebookInsights + reasoningPrompt,
                language: context.language,
                temperature: 0.7,
            });

            // Parse response
            let message = response.content;
            let reasoning = "";

            try {
                // Try to extract JSON from markdown if necessary
                let jsonText = message.trim();
                if (jsonText.includes('```json')) {
                    jsonText = jsonText.split('```json')[1].split('```')[0].trim();
                } else if (jsonText.includes('```')) {
                    jsonText = jsonText.split('```')[1].split('```')[0].trim();
                }

                const parsed = JSON.parse(jsonText);
                message = parsed.message || message;
                reasoning = parsed.reasoning || "";
            } catch (e) {
                console.warn('Failed to parse agent reasoning JSON:', e);
                // Keep original message as is
            }

            // Add assistant response to history
            this.addToConversation(context.conversationId, {
                role: 'assistant',
                content: message,
                timestamp: new Date(),
            });

            // Get suggested next steps
            const suggestedNext = await this.getSuggestedNext(history, context);

            // Add input tokens estimate
            const inputTokens = (userMessage.length + (notebookInsights.length || 0)) / 4;

            return {
                message,
                reasoning,
                suggestedNext,
                metadata: {
                    usage: {
                        totalTokens: (response.tokensUsed || 0) + Math.ceil(inputTokens)
                    }
                }
            };
        } catch (error) {
            console.error(`${this.name} Error:`, error);
            throw new Error(`Failed to process message: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Build system prompt with agent-specific instructions
     */
    protected buildSystemPrompt(context: AgentContext): string {
        let prompt = this.systemPrompt;

        // Add tool information if tools are available
        if (this.tools.size > 0) {
            prompt += '\n\nYou have access to the following tools:\n';
            this.tools.forEach(tool => {
                prompt += `- ${tool.name}: ${tool.description}\n`;
            });
            prompt += '\nTo use a tool, clearly indicate which tool you want to use and provide the required parameters.';
        }

        // Add language-specific instructions
        if (context.language === 'ar') {
            prompt += '\n\nIMPORTANT: Always respond in Arabic.';
        } else if (context.language === 'both') {
            prompt += '\n\nIMPORTANT: Provide your responses in both English and Arabic.';
        }

        return prompt;
    }

    /**
     * Detect if user message is requesting a tool
     */
    protected async detectToolRequest(
        message: string,
        context: AgentContext
    ): Promise<{ toolName: string; params: any } | null> {
        // Simple keyword-based detection
        // In production, this could use an LLM to detect intent

        for (const [toolName, tool] of this.tools.entries()) {
            // Check if message contains tool name keywords
            if (message.toLowerCase().includes(toolName.toLowerCase())) {
                // Extract parameters using LLM
                const params = await this.extractToolParams(message, tool, context);
                return { toolName, params };
            }
        }

        return null;
    }

    /**
     * Extract tool parameters from user message
     */
    protected async extractToolParams(
        message: string,
        tool: AgentTool,
        context: AgentContext
    ): Promise<any> {
        const prompt = `Extract the parameters for the following tool from the user's message.

Tool: ${tool.name}
Description: ${tool.description}
Parameters: ${JSON.stringify(tool.parameters, null, 2)}

User Message: ${message}

Return a JSON object with the extracted parameters. If a parameter is not mentioned, set it to null.`;

        try {
            return await llmService.extractJSON(prompt);
        } catch (error) {
            console.error('Parameter extraction error:', error);
            return {};
        }
    }

    /**
     * Execute a tool
     */
    protected async executeTool(
        toolName: string,
        params: any,
        context: AgentContext
    ): Promise<AgentResponse> {
        const tool = this.tools.get(toolName);

        if (!tool) {
            return {
                message: `Tool "${toolName}" not found.`,
            };
        }

        try {
            const result = await tool.execute(params, context);

            return {
                message: `Tool executed successfully: ${JSON.stringify(result, null, 2)}`,
                requiresAction: {
                    type: toolName,
                    data: result,
                },
            };
        } catch (error) {
            console.error(`Tool execution error (${toolName}):`, error);
            return {
                message: `Failed to execute tool "${toolName}": ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
        }
    }

    /**
   * Get suggested next steps based on conversation
   * Override in subclasses to provide agent-specific suggestions
   */
    protected async getSuggestedNext(
        history: AgentMessage[],
        context: AgentContext
    ): Promise<string[]> {
        // Default implementation - override in subclasses
        return [];
    }

    /**
     * Clear conversation history
     */
    clearConversation(conversationId: string): void {
        this.conversations.delete(conversationId);
    }

    /**
     * Get agent metadata
     */
    getMetadata(): {
        name: string;
        description: string;
        availableTools: string[];
    } {
        return {
            name: this.name,
            description: this.description,
            availableTools: Array.from(this.tools.keys()),
        };
    }
}

export default BaseAgent;
