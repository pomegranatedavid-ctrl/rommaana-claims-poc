import llmService from './llm-service';
import { ClaimData } from '../agents/claims-agent';

/**
 * Fraud Detection Service
 * Analyzes claims for potential fraud using AI and historical patterns
 */

export interface FraudRisk {
    riskLevel: 'low' | 'medium' | 'high';
    score: number; // 0-100
    flags: string[];
    recommendation: string;
}

class FraudDetectionService {

    // Mock historical data for demonstration
    private historicalClaims = [
        { plateNumber: 'ABC-1234', date: '2023-11-15' },
        { plateNumber: 'XYZ-5678', date: '2024-01-10' },
    ];

    /**
     * Assess fraud risk for a new claim
     */
    async assessRisk(claim: ClaimData): Promise<FraudRisk> {
        const flags: string[] = [];
        let score = 0;

        // 1. Initial heuristic checks
        if (!claim.dateOfIncident) {
            flags.push('Missing incident date');
            score += 10;
        }

        // Check for high value claims
        if (claim.estimatedValue && claim.estimatedValue > 50000) {
            flags.push('High value claim (>50k SAR)');
            score += 20;
        }

        // Check for frequency (mock)
        // In production, query database for claims by this policy/plate in last 12 months
        const recentClaims = this.historicalClaims.filter(c =>
            // Mock logic: randomly flag some plates or match description
            claim.description.includes('frequent')
        );

        if (recentClaims.length > 2) {
            flags.push('Multiple claims in recent history');
            score += 30;
        }

        // 2. AI-based Anomaly Detection
        try {
            const aiAnalysis = await llmService.extractJSON<{ anomalyScore: number; reasons: string[] }>(
                `Analyze this insurance claim for potential fraud or anomalies.
        
        Claim Type: ${claim.claimType}
        Description: "${claim.description}"
        Value: ${claim.estimatedValue || 'Unknown'}
        Incident Date: ${claim.dateOfIncident}
        
        Look for:
        - Inconsistencies in the story
        - Signs of staged accidents
        - Exaggerated damages
        - Suspicious timing (e.g., right after policy inception)
        
        Respond with JSON: { "anomalyScore": number (0-100), "reasons": string[] }`
            );

            score += aiAnalysis.anomalyScore;
            flags.push(...aiAnalysis.reasons);
        } catch (error) {
            console.warn('AI Fraud Analysis failed:', error);
        }

        // 3. Normalize score
        score = Math.min(score, 100);

        // 4. Determine risk level
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        if (score >= 70) riskLevel = 'high';
        else if (score >= 40) riskLevel = 'medium';

        // 5. Generate recommendation
        let recommendation = 'Proceed with standard processing.';
        if (riskLevel === 'high') {
            recommendation = 'Flag for manual investigation by SIU (Special Investigation Unit).';
        } else if (riskLevel === 'medium') {
            recommendation = 'Request additional documentation/photos.';
        }

        return {
            riskLevel,
            score,
            flags,
            recommendation,
        };
    }
}

export const fraudDetectionService = new FraudDetectionService();
export default fraudDetectionService;
