import vectorStore, { SearchResult } from './vector-store';
import llmService from './llm-service';

/**
 * RAG (Retrieval Augmented Generation) Service
 * Provides context-aware responses using IA regulatory documents
 */

export interface RAGQuery {
    question: string;
    collectionName?: string;
    maxResults?: number;
    requireSources?: boolean;
    language?: 'en' | 'ar' | 'both';
}

export interface RAGResponse {
    answer: string;
    sources: {
        id: string;
        content: string;
        title?: string;
        similarity: number;
    }[];
    confidence: number;
}

export interface RegulatoryContext {
    regulation: string;
    source: string;
    relevance: number;
}

class RAGService {
    private readonly DEFAULT_COLLECTION = 'ia_regulations';
    private readonly MIN_SIMILARITY = 0.7;

    /**
     * Query the RAG system with a question
     */
    async query(queryParams: RAGQuery): Promise<RAGResponse> {
        const {
            question,
            collectionName = this.DEFAULT_COLLECTION,
            maxResults = 5,
            requireSources = true,
            language = 'both',
        } = queryParams;

        try {
            // 1. Search for relevant documents
            const searchResults = await vectorStore.search(collectionName, question, {
                limit: maxResults,
                threshold: this.MIN_SIMILARITY,
            });

            if (searchResults.length === 0 && requireSources) {
                return {
                    answer: 'I could not find relevant regulatory information to answer your question. Please rephrase or consult the Insurance Authority directly.',
                    sources: [],
                    confidence: 0,
                };
            }

            // 2. Build context from retrieved documents
            const context = this.buildContext(searchResults);

            // 3. Generate answer using LLM with context
            const answer = await this.generateAnswer(question, context, language);

            // 4. Calculate confidence based on similarity scores
            const confidence = this.calculateConfidence(searchResults);

            // 5. Format sources
            const sources = searchResults.map(result => ({
                id: result.id,
                content: result.content.substring(0, 500) + '...', // Truncate for display
                title: result.metadata.title || result.metadata.source || 'Unknown Source',
                similarity: result.similarity,
            }));

            return {
                answer,
                sources,
                confidence,
            };
        } catch (error) {
            console.error('RAG Query Error:', error);
            throw new Error(`Failed to process RAG query: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Check if a policy or action complies with IA regulations
     */
    async checkCompliance(
        description: string,
        policyType?: string
    ): Promise<{
        compliant: boolean;
        violations: string[];
        recommendations: string[];
        relevantRegulations: RegulatoryContext[];
    }> {
        try {
            // Search for relevant regulations
            const query = `Regulations and requirements for ${policyType ? policyType + ' ' : ''}insurance: ${description}`;

            const searchResults = await vectorStore.search(this.DEFAULT_COLLECTION, query, {
                limit: 10,
                threshold: 0.6,
            });

            // Build regulatory context
            const relevantRegulations: RegulatoryContext[] = searchResults.map(result => ({
                regulation: result.content,
                source: result.metadata.title || result.metadata.source || 'IA Regulation',
                relevance: result.similarity,
            }));

            // Use LLM to analyze compliance
            const context = this.buildContext(searchResults);

            const prompt = `You are an Insurance Authority (IA) compliance expert. Analyze the following policy/action for compliance with Saudi Arabian insurance regulations.

Description: ${description}
${policyType ? `Policy Type: ${policyType}` : ''}

Relevant Regulations:
${context}

Provide a compliance analysis in the following JSON format:
{
  "compliant": true/false,
  "violations": ["list", "of", "violations"],
  "recommendations": ["list", "of", "recommendations"]
}`;

            const analysis = await llmService.extractJSON<{
                compliant: boolean;
                violations: string[];
                recommendations: string[];
            }>(prompt);

            return {
                ...analysis,
                relevantRegulations,
            };
        } catch (error) {
            console.error('Compliance Check Error:', error);
            throw new Error(`Failed to check compliance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all regulations related to a specific topic
     */
    async getRegulations(
        topic: string,
        options: {
            maxResults?: number;
            language?: 'en' | 'ar' | 'both';
        } = {}
    ): Promise<RegulatoryContext[]> {
        try {
            const searchResults = await vectorStore.search(this.DEFAULT_COLLECTION, topic, {
                limit: options.maxResults || 10,
                threshold: 0.65,
            });

            return searchResults.map(result => ({
                regulation: result.content,
                source: result.metadata.title || result.metadata.source || 'IA Regulation',
                relevance: result.similarity,
            }));
        } catch (error) {
            console.error('Get Regulations Error:', error);
            throw new Error(`Failed to get regulations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Build context string from search results
     */
    private buildContext(results: SearchResult[]): string {
        return results
            .map((result, index) => {
                const source = result.metadata.title || result.metadata.source || 'IA Document';
                return `[${index + 1}] Source: ${source}\n${result.content}\n`;
            })
            .join('\n---\n\n');
    }

    /**
     * Generate answer using LLM with retrieved context
     */
    private async generateAnswer(
        question: string,
        context: string,
        language: 'en' | 'ar' | 'both'
    ): Promise<string> {
        const systemPrompt = `You are an expert Insurance Authority (IA) assistant for Saudi Arabia. Your role is to provide accurate, compliant information based on official IA regulations.

Guidelines:
- Only use information from the provided regulatory context
- Always cite the source regulation when providing information
- If the context doesn't contain enough information, say so clearly
- Be precise and professional
- Focus on factual regulatory requirements
${language === 'ar' ? '- Respond in Arabic' : language === 'both' ? '- Provide your response in both English and Arabic' : '- Respond in English'}`;

        const userPrompt = `Based on the following Insurance Authority regulations:

${context}

Question: ${question}

Please provide a comprehensive answer citing the relevant regulations.`;

        const response = await llmService.chat(
            [{ role: 'user', content: userPrompt }],
            { systemPrompt, language, temperature: 0.3 }
        );

        return response.content;
    }

    /**
     * Calculate confidence score based on search results
     */
    private calculateConfidence(results: SearchResult[]): number {
        if (results.length === 0) return 0;

        // Average of top 3 similarities
        const topSimilarities = results.slice(0, 3).map(r => r.similarity);
        const avgSimilarity = topSimilarities.reduce((a, b) => a + b, 0) / topSimilarities.length;

        // Boost confidence if multiple high-quality results
        const highQualityCount = results.filter(r => r.similarity > 0.85).length;
        const boost = Math.min(highQualityCount * 0.05, 0.15);

        return Math.min(avgSimilarity + boost, 1.0);
    }

    /**
     * Index a regulatory document
     */
    async indexDocument(
        content: string,
        metadata: {
            id: string;
            title: string;
            source: string;
            type?: string;
            date?: string;
            [key: string]: any;
        }
    ): Promise<void> {
        try {
            // Split long documents into chunks
            const chunks = this.chunkDocument(content);

            // Create documents for each chunk
            const documents = chunks.map((chunk, index) => ({
                id: `${metadata.id}_chunk_${index}`,
                content: chunk,
                metadata: {
                    ...metadata,
                    chunk_index: index,
                    total_chunks: chunks.length,
                },
            }));

            // Add to vector store
            await vectorStore.addDocuments(this.DEFAULT_COLLECTION, documents);

            console.log(`Indexed document: ${metadata.title} (${chunks.length} chunks)`);
        } catch (error) {
            console.error('Index Document Error:', error);
            throw new Error(`Failed to index document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Chunk document into smaller pieces for better retrieval
     */
    private chunkDocument(content: string, maxChunkSize: number = 1000): string[] {
        const chunks: string[] = [];
        const paragraphs = content.split('\n\n');
        let currentChunk = '';

        for (const paragraph of paragraphs) {
            if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = paragraph;
            } else {
                currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }
}

// Export singleton instance
export const ragService = new RAGService();
export default ragService;
