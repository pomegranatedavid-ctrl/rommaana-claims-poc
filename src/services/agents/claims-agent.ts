import BaseAgent, { AgentContext, AgentResponse, AgentTool } from './base-agent';
import ragService from '../ai/rag-service';
import llmService from '../ai/llm-service';
import ocrService from '../ai/ocr-service';
import documentProcessor from '../documents/document-processor';
import claimsNLPService from '../ai/claims-nlp-service';
import fraudDetectionService from '../ai/fraud-detection-service';

/**
 * Claims Agent
 * Specialized AI agent for insurance claims processing
 * - Claim intake and validation
 * - Document processing
 * - Fraud risk assessment
 * - Status updates
 */

export interface ClaimData {
    claimId?: string;
    claimType: string;
    description: string;
    dateOfIncident: string;
    location?: string;
    parties?: string[];
    estimatedValue?: number;
    documents?: string[];
}

export interface FraudAssessment {
    riskLevel: 'low' | 'medium' | 'high';
    score: number;
    reasons: string[];
    recommendations: string[];
}

class ClaimsAgent extends BaseAgent {
    constructor() {
        const systemPrompt = `You are an AI Claims Agent for Rommaana Insurance, specialized in processing insurance claims in Saudi Arabia.

Your responsibilities:
1. Guide users through the claim submission process
2. Collect all necessary information and documents
3. Validate claims against Insurance Authority (IA) regulations
4. Assess fraud risk
5. Provide claim status updates
6. Ensure compliance with IA Claims Settlement regulations

Guidelines:
- Be empathetic and professional with claimants
- Ask clarifying questions when information is missing
- Explain the claims process clearly
- Validate all information against IA requirements
- Flag suspicious patterns to human adjusters
- Provide realistic timelines
- Always maintain data privacy and security

You must comply with:
- IA Claims Settlement Companies' Services regulation
- Motor Insurance Claims Settlement Instructions (for motor claims)
- Anti-Money Laundering Law
- Data protection requirements`;

        super(
            'Claims Agent',
            'AI assistant for insurance claims processing',
            systemPrompt,
            '2d0e5ace-1f01-4d8f-8fe1-dceff0948206' // Claims, Security & Compliance Notebook
        );

        // Register tools
        this.registerTools();
    }

    /**
     * Register agent tools
     */
    private registerTools(): void {
        // Tool: Process Document (Enhanced with IDP)
        this.registerTool({
            name: 'process_document',
            description: 'Extract text and structured data from a document image (ID, invoice, report)',
            parameters: {
                imageUrl: 'string',
                documentType: 'string (optional)',
            },
            execute: async (params: { imageUrl: string; documentType?: string }, context: AgentContext) => {
                return await documentProcessor.process(params.imageUrl, params.documentType);
            },
        });

        // Tool: Analyze Claim Description
        this.registerTool({
            name: 'analyze_claim',
            description: 'Analyze claim description for entities, sentiment, and urgency',
            parameters: {
                description: 'string',
            },
            execute: async (params: { description: string }, context: AgentContext) => {
                return await claimsNLPService.analyzeClaim(params.description);
            },
        });

        // Tool: Submit Claim
        this.registerTool({
            name: 'submit_claim',
            description: 'Submit a new claim with collected information',
            parameters: {
                claimType: 'string (motor, health, property, etc.)',
                description: 'string',
                dateOfIncident: 'ISO date string',
                location: 'string (optional)',
                estimatedValue: 'number (optional)',
                documents: 'string[] (optional URLs)',
            },
            execute: async (params: Partial<ClaimData>, context: AgentContext) => {
                return await this.submitClaim(params, context);
            },
        });

        // Tool: AssessFraud
        this.registerTool({
            name: 'assess_fraud',
            description: 'Assess fraud risk for a claim',
            parameters: {
                claimData: 'ClaimData object',
            },
            execute: async (params: { claimData: ClaimData }, context: AgentContext) => {
                return await this.assessFraud(params.claimData, context);
            },
        });

        // Tool: Check Compliance
        this.registerTool({
            name: 'check_compliance',
            description: 'Check if claim meets IA regulatory requirements',
            parameters: {
                claimData: 'ClaimData object',
            },
            execute: async (params: { claimData: ClaimData }, context: AgentContext) => {
                return await this.checkCompliance(params.claimData, context);
            },
        });

        // Tool: Get Claim Status
        this.registerTool({
            name: 'get_claim_status',
            description: 'Get the status of an existing claim',
            parameters: {
                claimId: 'string',
            },
            execute: async (params: { claimId: string }, context: AgentContext) => {
                return await this.getClaimStatus(params.claimId, context);
            },
        });
    }

    /**
     * Submit a new claim
     */
    private async submitClaim(
        claimData: Partial<ClaimData>,
        context: AgentContext
    ): Promise<{ claimId: string; status: string; message: string; analysis?: any }> {
        try {
            // Validate required fields
            if (!claimData.claimType || !claimData.description || !claimData.dateOfIncident) {
                throw new Error('Missing required fields: claimType, description, dateOfIncident');
            }

            // 1. Analyze claim description using NLP
            const analysis = await claimsNLPService.analyzeClaim(claimData.description);

            // 2. Check compliance with IA regulations
            const complianceCheck = await this.checkCompliance(claimData as ClaimData, context);

            if (!complianceCheck.compliant) {
                return {
                    claimId: '',
                    status: 'rejected',
                    message: `Claim does not meet IA requirements: ${complianceCheck.violations.join(', ')}`,
                };
            }

            // 3. Assess fraud risk using dedicated service
            const fraudResult = await fraudDetectionService.assessRisk({
                ...claimData,
                ...analysis // Pass NLP analysis for better context
            } as ClaimData);

            // Update status based on risk
            let status = 'submitted';
            if (fraudResult.riskLevel === 'low' && claimData.estimatedValue && claimData.estimatedValue < 5000) {
                status = 'auto_approved';
            } else if (fraudResult.riskLevel === 'high') {
                status = 'pending_investigation';
            } else {
                status = 'pending_review';
            }

            // Generate claim ID
            const claimId = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

            return {
                claimId,
                status,
                message: `Claim submitted successfully. Status: ${status}. ${fraudResult.recommendation}`,
                analysis: {
                    nlp: analysis,
                    fraud: fraudResult,
                },
            };
        } catch (error) {
            throw new Error(`Failed to submit claim: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Assess fraud risk using AI
     */
    private async assessFraud(
        claimData: ClaimData,
        context: AgentContext
    ): Promise<FraudAssessment> {
        try {
            const prompt = `You are a fraud detection expert for insurance claims in Saudi Arabia. Analyze the following claim for fraud risk.

Claim Details:
Type: ${claimData.claimType}
Description: ${claimData.description}
Date of Incident: ${claimData.dateOfIncident}
Location: ${claimData.location || 'Not specified'}
Estimated Value: ${claimData.estimatedValue || 'Not specified'}

Analyze for red flags such as:
- Inconsistencies in the description
- Unusual timing or patterns
- Exaggerated damages
- Suspicious parties or locations
- Lack of supporting details

Provide your assessment in the following JSON format:
{
  "riskLevel": "low" | "medium" | "high",
  "score": 0-100,
  "reasons": ["list", "of", "reasons"],
  "recommendations": ["list", "of", "recommendations"]
}`;

            const assessment = await llmService.extractJSON<FraudAssessment>(prompt);
            return assessment;
        } catch (error) {
            console.error('Fraud assessment error:', error);
            // Default to medium risk if assessment fails
            return {
                riskLevel: 'medium',
                score: 50,
                reasons: ['Unable to complete automated assessment'],
                recommendations: ['Manual review required'],
            };
        }
    }

    /**
     * Check compliance with IA regulations
     */
    private async checkCompliance(
        claimData: ClaimData,
        context: AgentContext
    ): Promise<{
        compliant: boolean;
        violations: string[];
        recommendations: string[];
    }> {
        try {
            const description = `${claimData.claimType} insurance claim: ${claimData.description}`;

            const complianceResult = await ragService.checkCompliance(
                description,
                claimData.claimType
            );

            return {
                compliant: complianceResult.compliant,
                violations: complianceResult.violations,
                recommendations: complianceResult.recommendations,
            };
        } catch (error) {
            console.error('Compliance check error:', error);
            // If check fails, default to manual review
            return {
                compliant: false,
                violations: ['Unable to verify compliance automatically'],
                recommendations: ['Manual compliance review required'],
            };
        }
    }

    /**
     * Get claim status
     */
    private async getClaimStatus(
        claimId: string,
        context: AgentContext
    ): Promise<{ claimId: string; status: string; updates: string[] }> {
        // In production, this would query the database
        // For now, return mock data
        return {
            claimId,
            status: 'pending_review',
            updates: [
                'Claim received and validated',
                'Documents under review',
                'Expected resolution: 5-7 business days',
            ],
        };
    }

    /**
     * Get suggested next steps based on conversation
     */
    protected override async getSuggestedNext(
        history: any[],
        context: AgentContext
    ): Promise<string[]> {
        const lastMessage = history[history.length - 1]?.content || '';

        // Simple rule-based suggestions
        if (lastMessage.toLowerCase().includes('submit') || lastMessage.toLowerCase().includes('new claim')) {
            return [
                'Provide claim details',
                'Upload supporting documents',
                'Check claim requirements',
            ];
        }

        if (lastMessage.toLowerCase().includes('status')) {
            return [
                'Get claim status update',
                'Upload additional documents',
                'Contact adjuster',
            ];
        }

        return [
            'Submit a new claim',
            'Check existing claim status',
            'Ask about claims process',
        ];
    }
}

// Export singleton instance
export const claimsAgent = new ClaimsAgent();
export default claimsAgent;
