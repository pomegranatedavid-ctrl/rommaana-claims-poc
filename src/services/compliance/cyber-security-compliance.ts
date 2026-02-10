import ragService from '../ai/rag-service';
import llmService from '../ai/llm-service';

/**
 * Cyber Security Compliance Service
 * specialized checks for SAMA and NCA cyber security regulations
 */

export interface CyberSecurityAssessment {
    score: number; // 0-100
    status: 'compliant' | 'partial' | 'non_compliant';
    gaps: string[];
    recommendations: string[];
    samaReferences: string[];
    ncaReferences: string[];
}

class CyberSecurityCompliance {

    /**
     * Assess compliance with SAMA Cyber Security Framework
     */
    async assessSAMACompliance(
        securityControls: string
    ): Promise<CyberSecurityAssessment> {
        return this.assessCompliance(securityControls, 'SAMA Cyber Security Framework');
    }

    /**
     * Assess compliance with NCA (National Cybersecurity Authority) regulations
     */
    async assessNCACompliance(
        securityControls: string
    ): Promise<CyberSecurityAssessment> {
        return this.assessCompliance(securityControls, 'NCA Essential Cybersecurity Controls (ECC)');
    }

    /**
     * General assessment logic
     */
    private async assessCompliance(
        controls: string,
        framework: string
    ): Promise<CyberSecurityAssessment> {
        try {
            // 1. Get relevant regulations using RAG
            const regulations = await ragService.query({
                question: `What are the key requirements for ${framework}?`,
                maxResults: 5
            }); // Note: This simplified call gets text, real implementation would get structured docs

            // 2. Use LLM to compare controls against regulations
            const prompt = `Assess the following security controls against ${framework} requirements based on the provided context.

      Security Controls:
      "${controls}"

      Regulatory Context:
      ${regulations.answer}

      Respond with JSON:
      {
        "score": number (0-100),
        "status": "compliant" | "partial" | "non_compliant",
        "gaps": string[],
        "recommendations": string[],
        "samaReferences": string[],
        "ncaReferences": string[]
      }`;

            const assessment = await llmService.extractJSON<CyberSecurityAssessment>(prompt);
            return assessment;

        } catch (error) {
            console.error('Cyber Security Assessment Error:', error);
            throw new Error(`Failed to assess cyber security compliance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Analyze an incident report for reporting requirements
     */
    async analyzeIncident(incidentDescription: string): Promise<{ reportable: boolean; deadline: string; authority: string }> {
        const prompt = `Analyze this cyber security incident and determine if it must be reported to SAMA or NCA.

    Incident: "${incidentDescription}"

    Respond with JSON:
    {
      "reportable": boolean,
      "deadline": "string (e.g., 'within 24 hours')",
      "authority": "string (e.g., 'SAMA', 'NCA', or 'Both')"
    }`;

        return await llmService.extractJSON(prompt);
    }
}

export const cyberSecurityCompliance = new CyberSecurityCompliance();
export default cyberSecurityCompliance;
