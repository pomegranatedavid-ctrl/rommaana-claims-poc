import BaseAgent, { AgentContext, AgentMessage } from './base-agent';
import ragService from '../ai/rag-service';
import complianceMonitor from '../compliance/compliance-monitor';
import cyberSecurityCompliance from '../compliance/cyber-security-compliance';
import contractAnalyzer from '../documents/contract-analyzer';
import regulatoryTrendsService from '../analytics/regulatory-trends';
import iaReportGenerator from '../reporting/ia-report-generator';
import performanceDashboard from '../analytics/performance-dashboard';

/**
 * Compliance Agent  
 * Real-time regulatory compliance monitoring and guidance
 */

class ComplianceAgent extends BaseAgent {
    constructor() {
        const systemPrompt = `You are an AI Compliance Agent specializing in Saudi Arabian insurance regulations (IA).

Your responsibilities:
1. Validate policies and processes against IA regulations
2. Provide compliance guidance and recommendations
3. Alert on potential regulatory violations
4. Answer questions about IA requirements
5. Monitor regulatory changes and trends

Guidelines:
- Always base answers on official IA regulations
- Cite specific regulations and sources
- Provide clear, actionable compliance guidance
- Flag potential violations immediately
- Stay updated on regulatory changes
- Be precise and authoritative`;

        super(
            'Compliance Agent',
            'AI assistant for regulatory compliance',
            systemPrompt,
            '4a8c797a-fd59-4fe8-9d3a-b969f8d5bfa5' // CNTXT Regulation Documents Notebook
        );
        this.registerTools();
    }

    private registerTools(): void {
        this.registerTool({
            name: 'check_compliance',
            description: 'Check if a policy or action complies with IA regulations',
            parameters: {
                description: 'string',
                policyType: 'string (optional)',
            },
            execute: async (params: { description: string; policyType?: string }) => {
                return await complianceMonitor.checkCompliance(params.description, params.policyType);
            },
        });

        // Tool: Generate IA Report
        this.registerTool({
            name: 'generate_ia_report',
            description: 'Generate a regulatory report for the Insurance Authority',
            parameters: {
                reportType: 'string (quarterly, annual)',
                period: 'string (optional)',
            },
            execute: async (params: { reportType: string; period?: string }, context: AgentContext) => {
                const report = await iaReportGenerator.generateReport({
                    reportType: params.reportType as any,
                    periodStart: params.period || '2025-01-01',
                    periodEnd: '2025-03-31',
                    department: 'Compliance',
                });
                return {
                    status: 'generated',
                    summary: 'Report generated successfully.',
                    preview: report.content.substring(0, 200) + '...',
                };
            },
        });

        // Tool: Get Performance Metrics
        this.registerTool({
            name: 'get_metrics',
            description: 'Get key performance indicators and dashboard metrics',
            parameters: {},
            execute: async (params: any, context: AgentContext) => {
                return await performanceDashboard.getMetrics();
            },
        });

        this.registerTool({
            name: 'get_requirements',
            description: 'Get regulatory requirements for a specific topic',
            parameters: { topic: 'string' },
            execute: async (params: { topic: string }) => {
                return await ragService.getRegulations(params.topic, { maxResults: 10 });
            },
        });

        // Tool: Analyze Contract
        this.registerTool({
            name: 'analyze_contract',
            description: 'Analyze a legal contract or policy against IA regulations',
            parameters: {
                contractText: 'string',
                contractType: 'string (optional)',
            },
            execute: async (params: { contractText: string; contractType?: string }, context: AgentContext) => {
                return await contractAnalyzer.analyze(params.contractText, params.contractType);
            },
        });

        this.registerTool({
            name: 'check_cyber_security',
            description: 'Assess compliance with SAMA/NCA cyber security regulations',
            parameters: {
                securityControls: 'string',
                framework: 'string (SAMA or NCA)',
            },
            execute: async (params: { securityControls: string; framework: string }) => {
                if (params.framework?.toUpperCase().includes('NCA')) {
                    return await cyberSecurityCompliance.assessNCACompliance(params.securityControls);
                }
                return await cyberSecurityCompliance.assessSAMACompliance(params.securityControls);
            },
        });

        this.registerTool({
            name: 'analyze_trend',
            description: 'Analyze historical regulatory trends for a topic',
            parameters: { topic: 'string' },
            execute: async (params: { topic: string }) => {
                return await regulatoryTrendsService.analyzeTrend(params.topic);
            },
        });
    }

    protected override async getSuggestedNext(
        history: AgentMessage[],
        context: AgentContext
    ): Promise<string[]> {
        return [
            'Check policy compliance',
            'SAMA Cyber Security check',
            'Analyze regulatory trends',
            'Get regulatory guidance',
        ];
    }
}

export const complianceAgent = new ComplianceAgent();
export default complianceAgent;
