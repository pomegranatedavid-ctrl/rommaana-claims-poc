import llmService from './llm-service';

/**
 * Claims NLP Service
 * Specialized NLP processing for insurance claims
 */

export interface ClaimAnalysis {
    entities: {
        parties: string[];
        vehicles: string[];
        locations: string[];
        dates: string[];
    };
    category: string;
    sentiment: {
        score: number;
        label: 'positive' | 'negative' | 'neutral';
    };
    urgency: 'low' | 'medium' | 'high';
    summary: string;
}

class ClaimsNLPService {

    /**
     * Analyze a claim description
     */
    async analyzeClaim(description: string): Promise<ClaimAnalysis> {
        try {
            // Parallel execution for speed
            const [entities, classification, sentiment, urgencyAndSummary] = await Promise.all([
                // 1. Extract Entities
                llmService.extractEntities(description, ['person_name', 'vehicle_details', 'location', 'date']),

                // 2. Classify Claim Type
                llmService.classify(description, [
                    'motor_accident',
                    'motor_theft',
                    'medical',
                    'property_damage',
                    'travel',
                    'other'
                ]),

                // 3. Sentiment Analysis
                llmService.analyzeSentiment(description),

                // 4. Urgency and Summary (combined LLM call)
                llmService.extractJSON<{ urgency: 'low' | 'medium' | 'high'; summary: string }>(
                    `Analyze this claim description:
          "${description}"
          
          1. Determine urgency (low/medium/high) based on severity and keywords.
          2. Provide a 1-sentence summary.`
                )
            ]);

            return {
                entities: {
                    parties: entities.person_name || [],
                    vehicles: entities.vehicle_details || [],
                    locations: entities.location || [],
                    dates: entities.date || [],
                },
                category: classification.category,
                sentiment: {
                    score: sentiment.score,
                    label: sentiment.sentiment,
                },
                urgency: urgencyAndSummary.urgency,
                summary: urgencyAndSummary.summary,
            };

        } catch (error) {
            console.error('Claim Analysis Error:', error);
            throw new Error(`Failed to analyze claim: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Check if description matches extracted data
     */
    async validateConsistency(
        description: string,
        extractedData: Record<string, any>
    ): Promise<{ consistent: boolean; inconsistencies: string[] }> {
        const prompt = `Compare the claim description with the extracted document data.
    
    Description: "${description}"
    
    Document Data: ${JSON.stringify(extractedData)}
    
    Identify any inconsistencies (e.g., different dates, wrong vehicle, mismatched names).
    
    Respond with JSON: { "consistent": boolean, "inconsistencies": string[] }`;

        return await llmService.extractJSON(prompt);
    }
}

export const claimsNLPService = new ClaimsNLPService();
export default claimsNLPService;
