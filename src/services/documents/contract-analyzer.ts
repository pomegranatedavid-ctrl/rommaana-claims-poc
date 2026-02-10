import llmService from '../ai/llm-service';
import ragService from '../ai/rag-service';

/**
 * Contract Analyzer Service
 * Analyzes legal contracts and policies for compliance and risk
 */

export interface ContractAnalysis {
    summary: string;
    riskScore: number; // 0-100
    flaggedClauses: Array<{ clause: string; issue: string; severity: 'low' | 'medium' | 'high' }>;
    missingClauses: string[];
    complianceStatus: 'compliant' | 'non_compliant' | 'review_required';
}

class ContractAnalyzer {

    /**
     * Analyze a contract text against IA regulations
     */
    async analyze(contractText: string, contractType: string = 'general'): Promise<ContractAnalysis> {
        try {
            // 1. Retrieve relevant regulations
            const regulations = await ragService.query({
                question: `What are the mandatory clauses and prohibited terms for ${contractType} contracts?`,
                maxResults: 5
            });

            // 2. Analyze using LLM
            const prompt = `Analyze the following insurance contract/policy against Saudi Insurance Authority regulations.

      Contract Text:
      "${contractText.substring(0, 10000)}" ... (truncated)

      Regulatory Context:
      ${regulations.answer}

      Identify:
      1. Dangerous or ambiguous clauses
      2. Missing mandatory clauses
      3. Overall compliance status

      Respond with JSON:
      {
        "summary": "string",
        "riskScore": number (0-100),
        "flaggedClauses": [{"clause": "text", "issue": "reason", "severity": "low|medium|high"}],
        "missingClauses": ["list of missing mandatory items"],
        "complianceStatus": "compliant" | "non_compliant" | "review_required"
      }`;

            return await llmService.extractJSON<ContractAnalysis>(prompt);

        } catch (error) {
            console.error('Contract Analysis Error:', error);
            throw new Error(`Failed to analyze contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Compare two contracts
     */
    async compare(contractA: string, contractB: string): Promise<string> {
        const prompt = `Compare these two contract versions and highlight key differences, risks, and improvements.
    
    Version A:
    ${contractA.substring(0, 5000)}
    
    Version B:
    ${contractB.substring(0, 5000)}
    
    Provide a bulleted summary of changes.`;

        const response = await llmService.complete(prompt);
        return response.content;
    }
}

export const contractAnalyzer = new ContractAnalyzer();
export default contractAnalyzer;
