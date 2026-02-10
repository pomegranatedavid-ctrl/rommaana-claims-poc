import llmService from '../ai/llm-service';

/**
 * Regulatory Trends Analytics Service
 * Analyzes historical IA data to identify trends and predict future regulations
 */

export interface RegulatoryTrend {
    topic: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    description: string;
    prediction: string;
    impactLevel: 'low' | 'medium' | 'high';
}

class RegulatoryTrendsService {

    // Mock historical data access (would connect to VectorDB/Historical DB in production)
    private historicalTopics = [
        { year: 2018, topics: ['digitization', 'fraud'] },
        { year: 2019, topics: ['cyber security', 'digitization'] },
        { year: 2020, topics: ['COVID-19', 'remote work', 'cyber security'] },
        { year: 2021, topics: ['insurtech', 'open banking', 'consumer protection'] },
        { year: 2022, topics: ['sustainability', 'AI', 'consumer protection'] },
        { year: 2023, topics: ['generative AI', 'resilience', 'sustainability'] },
    ];

    /**
     * Analyze trends for a specific topic
     */
    async analyzeTrend(topic: string): Promise<RegulatoryTrend> {
        try {
            // In production: Query historical documents for frequency of topic over time

            const prompt = `Analyze the regulatory trend for "${topic}" in the Saudi insurance market based on general knowledge and the following timeline context:
      ${JSON.stringify(this.historicalTopics)}

      Respond with JSON:
      {
        "topic": "${topic}",
        "trend": "increasing" | "decreasing" | "stable",
        "description": "string",
        "prediction": "string",
        "impactLevel": "low" | "medium" | "high"
      }`;

            return await llmService.extractJSON<RegulatoryTrend>(prompt);
        } catch (error) {
            console.error('Trend Analysis Error:', error);
            throw new Error(`Failed to analyze trend: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get top emerging risks
     */
    async getEmergingRisks(): Promise<string[]> {
        return [
            'AI Ethics & Bias',
            'Climate Change Impact',
            'Cyber warfare',
            'Digital Asset Insurance'
        ];
    }

    /**
     * Generate strategic recommendations based on trends
     */
    async generateStrategy(trends: RegulatoryTrend[]): Promise<string> {
        const prompt = `Generate strategic recommendations for an insurance company in Saudi Arabia based on these regulatory trends:
    ${JSON.stringify(trends)}
    
    Provide a concise strategic summary.`;

        const response = await llmService.complete(prompt);
        return response.content;
    }
}

export const regulatoryTrendsService = new RegulatoryTrendsService();
export default regulatoryTrendsService;
