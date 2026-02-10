import ragService from '../ai/rag-service';

/**
 * Compliance Monitor Service
 * Real-time monitoring and validation of insurance operations against IA regulations
 */

export interface ComplianceCheckResult {
    compliant: boolean;
    violations: string[];
    recommendations: string[];
    relevantRegulations: string[];
    riskLevel: 'low' | 'medium' | 'high';
    timestamp: string;
}

export interface ComplianceAlert {
    id: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    source: string;
    timestamp: string;
}

class ComplianceMonitor {
    private alerts: ComplianceAlert[] = [];

    /**
     * Check compliance of a policy or process
     */
    async checkCompliance(
        description: string,
        contextType: string = 'general'
    ): Promise<ComplianceCheckResult> {
        try {
            // Use RAG service to check compliance
            const ragResult = await ragService.checkCompliance(description, contextType);

            // Determine risk level based on violations
            let riskLevel: 'low' | 'medium' | 'high' = 'low';
            if (ragResult.violations.length > 0) {
                riskLevel = 'medium';
                if (ragResult.violations.some(v => v.toLowerCase().includes('prohibited') || v.toLowerCase().includes('must'))) {
                    riskLevel = 'high';
                }
            }

            const result: ComplianceCheckResult = {
                compliant: ragResult.compliant,
                violations: ragResult.violations,
                recommendations: ragResult.recommendations || [],
                relevantRegulations: ragResult.relevantRegulations?.map(r => `${r.source}: ${r.regulation.substring(0, 100)}...`) || [],
                riskLevel,
                timestamp: new Date().toISOString(),
            };

            // Generate alert if non-compliant
            if (!result.compliant) {
                this.generateAlert(
                    riskLevel === 'high' ? 'critical' : 'warning',
                    `Compliance violation detected in ${contextType}: ${result.violations[0]}`,
                    'ComplianceMonitor'
                );
            }

            return result;
        } catch (error) {
            console.error('Compliance Check Error:', error);
            throw new Error(`Failed to check compliance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Batch compliance check for multiple items
     */
    async batchCheck(items: Array<{ id: string; description: string; type: string }>) {
        const results = [];
        for (const item of items) {
            const result = await this.checkCompliance(item.description, item.type);
            results.push({ id: item.id, ...result });
        }
        return results;
    }

    /**
     * Generate a compliance alert
     */
    private generateAlert(severity: 'info' | 'warning' | 'critical', message: string, source: string) {
        const alert: ComplianceAlert = {
            id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            severity,
            message,
            source,
            timestamp: new Date().toISOString(),
        };
        this.alerts.unshift(alert);

        // In production, this would send email/SMS/Slack notifications
        if (severity === 'critical') {
            console.error(`[CRITICAL COMPLIANCE ALERT] ${message}`);
        } else {
            console.warn(`[Compliance Alert] ${message}`);
        }
    }

    /**
     * Get recent alerts
     */
    getAlerts(limit: number = 10): ComplianceAlert[] {
        return this.alerts.slice(0, limit);
    }

    /**
     * Validate a full insurance policy document
     * (Placeholder for future implementation using full document parsing)
     */
    async validatePolicyDocument(policyText: string): Promise<ComplianceCheckResult> {
        // Split policy into clauses and check each
        // For now, check as a single block
        return this.checkCompliance(policyText, 'policy_document');
    }
}

export const complianceMonitor = new ComplianceMonitor();
export default complianceMonitor;
