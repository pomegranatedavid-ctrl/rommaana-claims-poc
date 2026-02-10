import llmService from '../ai/llm-service';
import regulatoryTrendsService from '../analytics/regulatory-trends';

/**
 * Performance Dashboard Service
 * Analytics service for real-time dashboard data
 */

export interface DashboardMetric {
    id: string;
    label: string;
    value: number | string;
    change: number; // percentage
    trend: 'up' | 'down' | 'neutral';
    status: 'good' | 'warning' | 'critical';
}

class PerformanceDashboard {

    /**
     * Get main dashboard metrics
     */
    async getMetrics(): Promise<DashboardMetric[]> {
        // In production, aggregate real data from DB
        return [
            { id: 'claims_vol', label: 'Total Claims', value: 1250, change: 12, trend: 'up', status: 'good' },
            { id: 'proc_time', label: 'Avg Process Time', value: '3.2d', change: -15, trend: 'down', status: 'good' },
            { id: 'fraud_rate', label: 'Fraud Rate', value: '1.2%', change: 0.2, trend: 'up', status: 'warning' },
            { id: 'compliance', label: 'Compliance Score', value: '98.5%', change: 0.5, trend: 'up', status: 'good' },
        ];
    }

    /**
     * Get predictive insights
     */
    async getInsights(): Promise<string[]> {
        // Use LLM to generate insights from data
        return [
            'Claims volume expected to increase by 15% next month due to seasonality.',
            'Fraud attempts showing new pattern in vehicle repair invoices.',
            'Compliance score improved due to new automated checks.',
        ];
    }

    /**
     * Analyze comparative performance against market
     */
    async getMarketComparison(): Promise<string> {
        const prompt = `Compare current performance (3.2 days processing, 98.5% compliance) against Saudi insurance market benchmarks.
    Provide a brief strategic summary.`;

        const response = await llmService.complete(prompt);
        return response.content;
    }
}

export const performanceDashboard = new PerformanceDashboard();
export default performanceDashboard;
