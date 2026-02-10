import riskScoringService, { RiskFactors } from './risk-scoring-service';
import complianceMonitor from '../compliance/compliance-monitor';
import ragService from '../ai/rag-service';

/**
 * Accelerated Underwriting Service
 * Automates policy approval and pricing
 */

export interface UnderwritingDecision {
    decision: 'approved' | 'referred' | 'declined';
    quoteId?: string;
    premium?: number;
    conditions: string[];
    notes: string;
}

class AcceleratedUnderwritingService {

    /**
     * Process an application for accelerated underwriting
     */
    async processApplication(
        applicationId: string,
        riskFactors: RiskFactors
    ): Promise<UnderwritingDecision> {
        console.log(`Processing application ${applicationId}...`);

        // 1. Compliance Check
        // Ensure the requested coverage is valid per IA regulations
        const complianceCheck = await complianceMonitor.checkCompliance(
            `Issuing ${riskFactors.coverageType} policy for ${riskFactors.vehicleType} value ${riskFactors.vehicleValue}`,
            'underwriting'
        );

        if (!complianceCheck.compliant) {
            return {
                decision: 'declined',
                notes: `Compliance violation: ${complianceCheck.violations.join(', ')}`,
                conditions: [],
            };
        }

        // 2. Risk Assessment
        const riskAssessment = await riskScoringService.calculateRisk(riskFactors);

        // 3. Decision Logic
        if (riskAssessment.approvalStatus === 'decline') {
            return {
                decision: 'declined',
                notes: `High risk: ${riskAssessment.justification}`,
                conditions: riskAssessment.factors,
            };
        }

        if (riskAssessment.approvalStatus === 'refer_to_underwriter') {
            return {
                decision: 'referred',
                notes: `Referral required: ${riskAssessment.justification}`,
                conditions: riskAssessment.factors,
            };
        }

        // 4. Pricing Calculation (Simplified)
        const basePremium = this.calculateBasePremium(riskFactors);
        const finalPremium = basePremium * (1 + (riskAssessment.recommendedPremiumLoading / 100));

        // 5. Generate Quote (Mock)
        const quoteId = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        return {
            decision: 'approved',
            quoteId,
            premium: Math.round(finalPremium),
            conditions: [],
            notes: 'Auto-approved via accelerated underwriting',
        };
    }

    private calculateBasePremium(factors: RiskFactors): number {
        // Very simplified pricing logic
        let base = 1000;
        if (factors.coverageType === 'comprehensive') base = 2500;

        if (factors.vehicleValue) {
            base += factors.vehicleValue * 0.02; // 2% of value
        }

        return base;
    }
}

export const acceleratedUnderwriting = new AcceleratedUnderwritingService();
export default acceleratedUnderwriting;
