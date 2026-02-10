import llmService from '../ai/llm-service';

/**
 * Risk Scoring Service
 * ML-based risk assessment for underwriting
 */

export interface RiskFactors {
    age?: number;
    vehicleType?: string;
    vehicleValue?: number;
    location?: string;
    drivingHistory?: string;
    claimsHistory?: number;
    coverageType: string;
}

export interface RiskAssessment {
    score: number; // 0-100 (Higher is riskier)
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendedPremiumLoading: number; // Percentage increase
    maxCoverageLimit: number;
    approvalStatus: 'auto_approve' | 'refer_to_underwriter' | 'decline';
    justification: string;
}

class RiskScoringService {

    /**
     * Calculate risk score for a policy application
     */
    async calculateRisk(factors: RiskFactors): Promise<RiskAssessment> {
        try {
            // In production, this would call a Python ML model or robust rule engine
            // Here we use LLM + Heuristics for the POC

            const prompt = `Assess the underwriting risk for this insurance application based on Saudi market standards.

      Applicant Data:
      ${JSON.stringify(factors, null, 2)}

      Consider:
      - Vehicle value and type (luxury/sports cars are higher risk)
      - Driver age (<25 is higher risk)
      - Claims history
      - Coverage type

      Respond with JSON:
      {
        "score": number (0-100),
        "riskLevel": "low" | "medium" | "high" | "critical",
        "factors": ["list of key risk drivers"],
        "recommendedPremiumLoading": number (percentage 0-50),
        "approvalStatus": "auto_approve" | "refer_to_underwriter" | "decline",
        "justification": "short summary"
      }`;

            const assessment = await llmService.extractJSON<RiskAssessment>(prompt);

            // Apply hard rules (overriding LLM if necessary)
            if (factors.vehicleValue && factors.vehicleValue > 500000) {
                assessment.approvalStatus = 'refer_to_underwriter';
                assessment.factors.push('High value vehicle > 500k');
            }

            if (factors.age && factors.age < 18) {
                assessment.approvalStatus = 'decline';
                assessment.riskLevel = 'critical';
                assessment.factors.push('Underage driver');
            }

            return assessment;

        } catch (error) {
            console.error('Risk Scoring Error:', error);
            // Fallback safe default
            return {
                score: 50,
                riskLevel: 'medium',
                factors: ['Error in risk calculation, manual review required'],
                recommendedPremiumLoading: 0,
                maxCoverageLimit: 0,
                approvalStatus: 'refer_to_underwriter',
                justification: 'System error during assessment',
            };
        }
    }

    /**
     * Train/Update model (Placeholder)
     */
    async updateModel() {
        console.log('Updating risk models with latest claims data...');
        // Implementation would involve retraining ML models
    }
}

export const riskScoringService = new RiskScoringService();
export default riskScoringService;
