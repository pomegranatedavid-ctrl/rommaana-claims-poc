import BaseAgent, { AgentContext, AgentMessage } from './base-agent';
import acceleratedUnderwriting from '../underwriting/accelerated-underwriting';
import riskScoringService from '../underwriting/risk-scoring-service';
import policyGenerator from '../documents/policy-generator';
import ragService from '../ai/rag-service';

/**
 * Policy Agent
 * Handle policy quotations, issuance, and renewals
 */

class PolicyAgent extends BaseAgent {
    constructor() {
        const systemPrompt = `You are an AI Policy Agent for Rommaana Insurance in Saudi Arabia.

Your responsibilities:
1. Generate insurance policy quotations
2. Guide users through policy selection
3. Process policy issuance
4. Handle policy renewals
5. Explain coverage options

Guidelines:
- Provide accurate, competitive quotations
- Explain policy terms clearly
- Ensure all policies comply with IA standards
- Recommend appropriate coverage levels
- Process policies efficiently
- Support Arabic and English`;

        super('Policy Agent', 'AI assistant for policy management', systemPrompt);
        this.registerTools();
    }

    private registerTools(): void {
        // Tool: Get Quote (Enhanced with Accelerated Underwriting)
        this.registerTool({
            name: 'get_quote',
            description: 'Generate an insurance quote based on vehicle/driver details using accelerated underwriting',
            parameters: {
                driverAge: 'number',
                vehicleType: 'string',
                vehicleValue: 'number',
                coverageType: 'string (comprehensive, tpl)',
            },
            execute: async (params: { driverAge: number; vehicleType: string; vehicleValue: number; coverageType: string }, context: AgentContext) => {
                // Use accelerated underwriting service
                const result = await acceleratedUnderwriting.processApplication(
                    `APP-${Date.now()}`,
                    {
                        age: params.driverAge,
                        vehicleType: params.vehicleType,
                        vehicleValue: params.vehicleValue,
                        coverageType: params.coverageType,
                    }
                );
                return result;
            },
        });

        // Tool: Issue Policy
        this.registerTool({
            name: 'issue_policy',
            description: 'Issue a policy document after approval and payment',
            parameters: {
                quoteId: 'string',
                customerName: 'string',
                vehicleDetails: 'string',
                premium: 'number',
            },
            execute: async (params: { quoteId: string; customerName: string; vehicleDetails: string; premium: number }, context: AgentContext) => {
                // Generate policy document
                const policy = await policyGenerator.generatePolicy({
                    quoteId: params.quoteId,
                    policyNumber: `POL-${Date.now()}`,
                    customerName: params.customerName,
                    vehicleDetails: params.vehicleDetails,
                    coverageType: 'Comprehensive', // Should come from quote
                    premium: params.premium,
                    validFrom: new Date().toISOString().split('T')[0],
                    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                }, 'en');

                return {
                    status: 'issued',
                    policyNumber: `POL-${Date.now()}`,
                    documentUrl: policy.url,
                    message: 'Policy issued successfully. Document has been sent to your email.',
                };
            },
        });

        // Tool: Assess Risk (Internal use mainly)
        this.registerTool({
            name: 'assess_risk',
            description: 'Calculate risk score for a driver/vehicle profile',
            parameters: {
                age: 'number',
                vehicleType: 'string',
                history: 'string (optional)', // This parameter is defined but not used in the execute function below
            },
            execute: async (params: { age: number; vehicleType: string }, context: AgentContext) => {
                return await riskScoringService.calculateRisk({
                    age: params.age,
                    vehicleType: params.vehicleType,
                    coverageType: 'comprehensive' // Default for check
                });
            },
        });

        this.registerTool({
            name: 'check_policy_compliance',
            description: 'Verify policy meets IA standards',
            parameters: { policyDetails: 'object' },
            execute: async (params: { policyDetails: any }) => {
                return await ragService.checkCompliance(
                    JSON.stringify(params.policyDetails),
                    params.policyDetails.type
                );
            },
        });
    }

    protected override async getSuggestedNext(): Promise<string[]> {
        return [
            'Get insurance quote',
            'Review policy options',
            'Purchase policy',
        ];
    }
}

export const policyAgent = new PolicyAgent();
export default policyAgent;
