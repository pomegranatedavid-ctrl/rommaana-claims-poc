import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

/**
 * Central LLM Service for AI operations
 * Uses Google Gemini for better Arabic language support
 */

export interface LLMMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface LLMOptions {
    temperature?: number;
    maxTokens?: number;
    language?: 'en' | 'ar' | 'both';
    systemPrompt?: string;
}

export interface LLMResponse {
    content: string;
    tokensUsed: number;
    finishReason: string;
}

class LLMService {
    private genAI: GoogleGenerativeAI | undefined;
    private model: GenerativeModel | undefined;
    private defaultConfig: GenerationConfig;

    constructor() {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (apiKey) {
            console.log(`LLM Service initialized with API key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
            this.genAI = new GoogleGenerativeAI(apiKey);

            // Use Gemini 1.5 Flash for the best balance of speed and capability
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
            });
        } else {
            console.warn('LLM Service initialized WITHOUT API KEY. Some features will be disabled.');
        }

        this.defaultConfig = {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.95,
            topK: 40,
        };
    }

    private checkInitialized(): void {
        if (!this.genAI || !this.model) {
            const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error('Google Gemini API Key is missing. Please add GOOGLE_GEMINI_API_KEY to your environment variables.');
            }

            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
            });
        }
    }

    /**
     * Generate a completion with conversation history
     */
    async chat(
        messages: LLMMessage[],
        options: LLMOptions = {}
    ): Promise<LLMResponse> {
        this.checkInitialized();
        try {
            const config: GenerationConfig = {
                ...this.defaultConfig,
                temperature: options.temperature ?? this.defaultConfig.temperature,
                maxOutputTokens: options.maxTokens ?? this.defaultConfig.maxOutputTokens,
            };

            // Build the prompt with system message and conversation history
            let prompt = '';

            if (options.systemPrompt) {
                prompt += `${options.systemPrompt}\n\n`;
            }

            // Add language instruction if specified
            if (options.language === 'ar') {
                prompt += 'Please respond in Arabic.\n\n';
            } else if (options.language === 'both') {
                prompt += 'Please provide your response in both English and Arabic.\n\n';
            }

            // Add conversation history
            for (const msg of messages) {
                const roleLabel = msg.role === 'user' ? 'User' : 'Assistant';
                prompt += `${roleLabel}: ${msg.content}\n\n`;
            }

            // Remove trailing newlines
            prompt = prompt.trim();

            let result;
            try {
                result = await this.model!.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: config,
                });
            } catch (modelError: any) {
                // If the specific model name failed with 404, try a more standard one
                if (modelError?.message?.includes('404') || modelError?.message?.includes('not found')) {
                    console.warn(`Model ${this.model!.model} failed, falling back to gemini-pro...`);
                    const fallbackModel = this.genAI!.getGenerativeModel({ model: 'gemini-pro' });
                    result = await fallbackModel.generateContent({
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                        generationConfig: config,
                    });
                } else {
                    throw modelError;
                }
            }

            const response = result.response;
            let text = '';

            try {
                text = response.text();
            } catch (textError) {
                console.warn('Failed to extract text from response, checking candidates:', textError);
                // Fallback to manual candidate extraction if text() throws due to safety filters
                const candidate = response.candidates?.[0];
                if (candidate?.content?.parts?.[0]?.text) {
                    text = candidate.content.parts[0].text;
                } else if (candidate?.finishReason === 'SAFETY') {
                    text = 'I apologize, but I cannot provide a response to that specific request due to safety guidelines.';
                } else {
                    text = 'Empty or blocked response received from AI model.';
                }
            }

            return {
                content: text,
                tokensUsed: response.usageMetadata?.totalTokenCount || 0,
                finishReason: response.candidates?.[0]?.finishReason || 'STOP',
            };
        } catch (error: any) {
            console.error('LLM Service Error Type:', typeof error);
            console.error('LLM Service Error Message:', error?.message || error);

            // Check for rate limit or quota errors
            if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
                throw new Error('Due to the amount of request at this moment, we are experiencing a high volume of processing tasks. Please wait 60 seconds and retry');
            }

            throw new Error(`Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate a single completion (no conversation history)
     */
    async complete(
        prompt: string,
        options: LLMOptions = {}
    ): Promise<LLMResponse> {
        return this.chat([{ role: 'user', content: prompt }], options);
    }

    /**
     * Generate embeddings for text
     */
    async embed(text: string): Promise<number[]> {
        this.checkInitialized();
        try {
            const embeddingModel = this.genAI!.getGenerativeModel({
                model: 'text-embedding-004'
            });

            const result = await embeddingModel.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error('Embedding Error:', error);
            throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate embeddings for multiple texts in batch
     */
    async embedBatch(texts: string[]): Promise<number[][]> {
        this.checkInitialized();
        try {
            const embeddingModel = this.genAI!.getGenerativeModel({
                model: 'text-embedding-004'
            });

            const embeddings: number[][] = [];

            // Process in batches of 10 to avoid rate limits
            const batchSize = 10;
            for (let i = 0; i < texts.length; i += batchSize) {
                const batch = texts.slice(i, i + batchSize);
                const batchResults = await Promise.all(
                    batch.map(text => embeddingModel.embedContent(text))
                );
                embeddings.push(...batchResults.map(r => r.embedding.values));
            }

            return embeddings;
        } catch (error) {
            console.error('Batch Embedding Error:', error);
            throw new Error(`Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Extract structured data using JSON mode
     */
    async extractJSON<T>(
        prompt: string,
        schema?: string
    ): Promise<T> {
        try {
            let fullPrompt = prompt;

            if (schema) {
                fullPrompt += `\n\nPlease respond with a JSON object matching this schema:\n${schema}`;
            } else {
                fullPrompt += '\n\nPlease respond with a valid JSON object.';
            }

            const response = await this.complete(fullPrompt, { temperature: 0.1 });

            // Extract JSON from the response (handle markdown code blocks)
            let jsonText = response.content.trim();

            // Remove markdown code block if present
            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.replace(/```json\n/, '').replace(/\n```$/, '');
            } else if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/```\n/, '').replace(/\n```$/, '');
            }

            return JSON.parse(jsonText) as T;
        } catch (error) {
            console.error('JSON Extraction Error:', error);
            throw new Error(`Failed to extract JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Classify text into categories
     */
    async classify(
        text: string,
        categories: string[],
        options: LLMOptions = {}
    ): Promise<{ category: string; confidence: number }> {
        const prompt = `Classify the following text into one of these categories: ${categories.join(', ')}

Text: ${text}

Respond with a JSON object with "category" and "confidence" (0-1) fields.`;

        const result = await this.extractJSON<{ category: string; confidence: number }>(prompt);
        return result;
    }

    /**
     * Extract named entities from text
     */
    async extractEntities(
        text: string,
        entityTypes: string[]
    ): Promise<Record<string, string[]>> {
        const prompt = `Extract the following entity types from the text: ${entityTypes.join(', ')}

Text: ${text}

Respond with a JSON object where keys are entity types and values are arrays of extracted entities.`;

        return this.extractJSON<Record<string, string[]>>(prompt);
    }

    /**
     * Perform sentiment analysis
     */
    async analyzeSentiment(
        text: string
    ): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; score: number }> {
        const prompt = `Analyze the sentiment of this text and provide a score from -1 (very negative) to 1 (very positive).

Text: ${text}

Respond with a JSON object with "sentiment" (positive/negative/neutral) and "score" (-1 to 1) fields.`;

        return this.extractJSON<{ sentiment: 'positive' | 'negative' | 'neutral'; score: number }>(prompt);
    }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;
