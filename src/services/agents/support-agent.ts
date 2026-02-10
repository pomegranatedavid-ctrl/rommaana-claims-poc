import BaseAgent, { AgentContext } from './base-agent';
import ragService from '../ai/rag-service';

/**
 * Support Agent
 * General customer support and inquiries
 */

class SupportAgent extends BaseAgent {
    constructor() {
        const systemPrompt = `You are an AI Support Agent for Rommaana Insurance in Saudi Arabia.

Your responsibilities:
1. Answer general insurance questions
2. Explain policy terms and coverages
3. Help with account and policy inquiries
4. Guide users to the right resources
5. Escalate to human agents when needed

Guidelines:
- Be friendly, helpful, and patient
- Provide accurate information based on IA regulations
- Always cite regulatory sources when relevant
- Offer to escalate complex issues
- Support both Arabic and English
- Maintain professionalism`;

        super('Support Agent', 'AI assistant for general customer support', systemPrompt);
        this.registerTools();
    }

    private registerTools(): void {
        this.registerTool({
            name: 'search_regulations',
            description: 'Search IA regulations for specific information',
            parameters: { topic: 'string' },
            execute: async (params: { topic: string }) => {
                const regulations = await ragService.getRegulations(params.topic, { maxResults: 5 });
                return { regulations };
            },
        });

        this.registerTool({
            name: 'escalate_to_human',
            description: 'Escalate inquiry to human agent',
            parameters: { reason: 'string' },
            execute: async (params: { reason: string }) => {
                return {
                    escalated: true,
                    ticket_id: `TKT-${Date.now()}`,
                    message: 'Your inquiry has been escalated. A human agent will contact you within 24 hours.',
                };
            },
        });
    }

    protected override async getSuggestedNext(): Promise<string[]> {
        return [
            'Ask about insurance coverage',
            'Check policy details',
            'Contact human agent',
        ];
    }
}

export const supportAgent = new SupportAgent();
export default supportAgent;
