export type ClaimStatus = 'ANALYZING' | 'APPROVED' | 'REFERRED_TO_HUMAN' | 'REJECTED';
import { NotebookLMService } from "./notebooklm-service";


const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export interface AgentResponse {
    agentName: string;
    message: string;
    action?: ClaimStatus;
    data?: any;
}

// Real-ish Vision Agent calling internal Gemini route
export const VisionAgent = {
    analyzeImage: async (file: File, userStatement?: string, config?: any): Promise<AgentResponse> => {
        try {
            const base64 = await fileToBase64(file);
            const workshopContext = config ? `
            Use the following Workshop Rates for estimation:
            - Base Labor: SAR ${config.laborRate}/hr
            - Paint Rate: SAR ${config.paintRate}/panel
            - Parts Prices: ${JSON.stringify(config.partsPrices)}
            - Total Loss Threshold: ${config.totalLossThreshold}%
            ` : "Use standard KSA repair rates (Bumper: 800-1200 SAR, Paint: 400-600 SAR).";

            const correlationContext = userStatement ? `
            The user claims the following happened: "${userStatement}". 
            STRICT REQUIREMENT: Verify if the visual evidence in the photo MANTORILY supports this specific story. 
            If there is a mismatch (e.g., they say 'front hit' but photo shows rear, or they say 'totaled' but photo shows a scratch), you MUST flag this as a 'Mismatch'.
            ` : "Analyze the damage neutrally but skeptically.";

            const res = await fetch("/api/vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: base64,
                    prompt: `You are an ADVERSARIAL Saudi insurance claims adjuster AI. Your goal is to be accurate and prevent insurance fraud. 
                    Analyze this image of vehicle damage in Riyadh. 
                    ${workshopContext}
                    ${correlationContext}
                    
                    TASKS:
                    1. Identify all damaged parts and the nature of damage (dent, scratch, structural deformation).
                    2. Check for "Pre-existing damage" indicators (e.g., rust on a fresh dent).
                    3. Calculate a Damage Score (0-100) and Confidence Level (0-100).
                    4. Estimate repair cost in SAR.
                    
                    Format your response AS A VALID JSON STRING with:
                    - 'message': A professional, slightly skeptical summary of findings.
                    - 'data': {
                        'damageScore': number,
                        'confidence': number,
                        'estimatedSAR': number,
                        'parts': string[],
                        'isStructural': boolean,
                        'storyMatch': boolean,
                        'fraudFlags': string[]
                    }`
                })
            });
            const data = await res.json();

            // Try to parse the response if it's JSON within text, or just use the text
            try {
                const parsed = JSON.parse(data.text.replace(/```json|```/g, "").trim());
                return {
                    agentName: "Rommaana Vision Agent",
                    message: parsed.message,
                    data: parsed.data
                };
            } catch {
                return {
                    agentName: "Rommaana Vision Agent",
                    message: data.text,
                    data: { damageScore: 50, parts: ["Unknown"] } // Default fallback
                };
            }
        } catch (error) {
            console.error("Vision Analysis Failed:", error);
            return {
                agentName: "Rommaana Vision Agent",
                message: "Vision Mesh encountered an internal error during signal processing.",
                data: { damageScore: 0, parts: [] }
            };
        }
    },

    analyzeDetailSim: async (mockPath: string, config?: any): Promise<AgentResponse> => {
        // Simulation for Admin Panel
        const rates = config || { laborRate: 150, paintRate: 500, partsPrices: { bumper: 1200 } };
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    agentName: "Rommaana Vision Agent (Simulated)",
                    message: `Analysis of ${mockPath} using Labor Rate: SAR ${rates.laborRate}/hr. Detected bumper impact. Total estimated cost: SAR ${rates.partsPrices.bumper + (rates.laborRate * 2)}.`,
                    data: { damageScore: 45, parts: ["Bumper"], estimatedSAR: rates.partsPrices.bumper + (rates.laborRate * 2) }
                });
            }, 1500);
        });
    },

    analyzeDetail: async (imagePath: string): Promise<{ detection: string; relevance: string }> => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (imagePath.includes("scratch") || imagePath.includes("volvo")) {
            return {
                detection: "Linear abrasions with paint transfer and slight indentation on the white polyurethane substrate. Identifying asset: Volvo XC90 SUV.",
                relevance: "The height and directionality of the abrasions (approx. 45cm from ground) perfectly match the reported collision with a mall parking pillar. Confirms B2C customer statement."
            };
        }
        if (imagePath.includes("severe") || imagePath.includes("crash")) {
            return {
                detection: "Major deformation of the longitudinal members. Airbag deployment confirmed via sensor data and visual evidence.",
                relevance: "Critical structural failure indicates the repair cost will exceed 75% of the vehicle value. This image justifies the immediate 'Total Loss' recommendation."
            };
        }
        if (imagePath.includes("water") || imagePath.includes("flood")) {
            return {
                detection: "Waterline marks visible at 15cm from floor level. Saturated corrugated packaging showing signs of structural collapse.",
                relevance: "The moisture ingress depth exceeds the 'safe-stacking' threshold for electronics. This validates the business interruption liability and inventory loss claim."
            };
        }
        if (imagePath.includes("aerial") || imagePath.includes("resort") || imagePath.includes("warehouse") || imagePath.includes("tower")) {
            return {
                detection: "Vegetation-free flood channel identified in close proximity. Site elevation is below the 50-year flood line.",
                relevance: "Hydrological analysis of this specific site pixel confirms a 5/5 risk score. This visual evidence supports the premium loading for 'Force Majeure' events."
            };
        }

        return {
            detection: "High-resolution capture of the specified asset. No immediate anomalies detected in this frame.",
            relevance: "Serves as baseline 'Pre-Incident' state documentation for the permanent ledger."
        };
    },

    answerQuestion: async (imagePath: string, question: string): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const q = question.toLowerCase();

        if (q.includes("brand") || q.includes("make") || q.includes("car")) {
            if (imagePath.includes("scratch") || imagePath.includes("volvo")) return "Based on the signature grille and Thor's Hammer headlights, this is a white Volvo XC90. It is a modern luxury SUV model.";
            if (imagePath.includes("crash") || imagePath.includes("severe")) return "The vehicle is a silver SUV consistent with high-occupancy family models. The structural damage makes specific sub-model identification difficult without VIN access.";
        }

        if (q.includes("damage") || q.includes("where")) {
            if (imagePath.includes("scratch")) return "The main damage is located on the rear right quarter panel and bumper, consisting of surface abrasions and slight paint removal.";
            if (imagePath.includes("water")) return "The damage is systemic throughout the lower internal structure, visible as silt deposits and waterlines on the packaging.";
            return "No obvious structural anomalies are detected in this specific frame.";
        }

        if (q.includes("total loss") || q.includes("worth")) {
            if (imagePath.includes("severe")) return "Yes, the structural deformation to the pillar and frame rail is non-negotiable for safety. This vehicle is certainly a total loss.";
            return "Current visual evidence suggests this is purely cosmetic and does not warrant a total loss designation.";
        }

        return "I've analyzed the image for that specific detail. Based on current vision mesh data, I can confirm the features align with standard case documentation, but I'll need a different angle for higher confidence on that specific query.";
    }
};

// Simulated Fraud Agent (Data Patterns & Provenance)
export const FraudAgent = {
    verifyImageProvenance: async (filename: string): Promise<AgentResponse> => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const suspiciousKeywords = ["download", "internet", "screenshot", "stock", "google", "web"];
        const isSuspicious = suspiciousKeywords.some(keyword => filename.toLowerCase().includes(keyword));

        if (isSuspicious) {
            return {
                agentName: "Rommaana Fraud Agent",
                message: "FRAUD ALERT: Image filename suggests internet origin or screenshot. Image metadata (EXIF) is missing location/timestamp signatures.",
                data: { riskLevel: "CRITICAL", fraudType: "Image Provenance" }
            };
        }

        return {
            agentName: "Rommaana Fraud Agent",
            message: "Image provenance verified. EXIF metadata matches incident profile (GPS/Timestamp match).",
            data: { riskLevel: "LOW" }
        };
    },

    checkHistory: async (userId: string): Promise<AgentResponse> => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (userId === "FRAUD123") {
            return {
                agentName: "Rommaana Fraud Agent",
                message: "Alert: This user has filed 3 claims in the last month. Flagging for manual review.",
                data: { riskLevel: "HIGH" }
            };
        }

        return {
            agentName: "Rommaana Fraud Agent",
            message: "Customer history is clean. No anomalies detected.",
            data: { riskLevel: "LOW" }
        };
    }
}

// Simulated Decision Agent (Rules Engine)
export const DecisionAgent = {
    makeDecision: async (visionData: any, fraudData: any): Promise<AgentResponse> => {
        // Logic Gate: Stricter Adjudication Rules
        const sarValue = visionData.estimatedSAR || 0;
        const confidence = visionData.confidence || 0;
        const hasFlags = visionData.fraudFlags && visionData.fraudFlags.length > 0;

        // Rule 1: Fraud or Mismatch -> Immediate Referral
        if (fraudData.riskLevel === "HIGH" || fraudData.riskLevel === "CRITICAL" || !visionData.storyMatch || hasFlags) {
            return {
                agentName: "Rommaana Decision Agent",
                message: !visionData.storyMatch
                    ? "DECISION: Referral to Investigations. The visual evidence does not correlate with the user's statement of events."
                    : "DECISION: Integrity Shield Alert. Risk parameters exceed automated threshold. Refer for manual technical audit.",
                action: "REFERRED_TO_HUMAN",
                data: { reason: "Policy Deviation/Fraud Risk", sar: sarValue }
            };
        }

        // Rule 2: Low Confidence -> Refer
        if (confidence < 85) {
            return {
                agentName: "Rommaana Decision Agent",
                message: "DECISION: Ambiguous Visual Data. The neural confidence score is below 85%. Referring to human adjuster for validation.",
                action: "REFERRED_TO_HUMAN",
                data: { reason: "Low Vision Confidence", confidence }
            };
        }

        // Rule 3: High Value or Structural -> Refer
        if (sarValue > 5000 || visionData.isStructural) {
            return {
                agentName: "Rommaana Decision Agent",
                message: visionData.isStructural
                    ? "DECISION: Structural Risk Detected. Aligned with safety protocols, all structural impacts require human sign-off."
                    : `DECISION: High-Value Threshold Exceeded (SAR ${sarValue.toLocaleString()}). Referring to Senior Adjuster for final approval.`,
                action: "REFERRED_TO_HUMAN",
                data: { reason: visionData.isStructural ? "Structural Damage" : "High Value", sar: sarValue }
            };
        }

        // Rule 4: Clean, Low-Value, High-Confidence -> Auto-Approve
        return {
            agentName: "Rommaana Decision Agent",
            message: `DECISION: Verified Instant Approval. Damage is localized, non-structural, and aligns with partner workshop rates. Total: SAR ${sarValue.toLocaleString()}.`,
            action: "APPROVED",
            data: { regulatoryNote: "IA Article 47 Compliant", citation: "Circular 2025/11", sar: sarValue }
        };
    }
}

// Simulated Sales Copilot
export const SalesAgent = {
    generateScript: async (leadName: string, product: string, objection?: string): Promise<AgentResponse> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        if (objection?.includes("expensive")) {
            return {
                agentName: "Rommaana Sales Copilot",
                message: "I understand price is a concern. However, for just SAR 50 more per month, this comprehensive plan covers agency repair. One minor accident without it could cost you SAR 5,000. Is peace of mind worth the price of one coffee a day?"
            }
        }

        return {
            agentName: "Rommaana Sales Copilot",
            message: `Hello ${leadName}, I noticed you recently upgraded your vehicle. Congratuations! I'm calling because your current TPL policy leaves your new asset completely unprotected. We have a special rate for 2026 models today.`
        }
    }
}

// Simulated Compliance & Risk Agents
export const RiskAgent = {
    assessRisk: async (applicationType: string, location: string): Promise<AgentResponse> => {
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (location.includes("Wadi")) {
            return {
                agentName: "Rommaana Risk Agent",
                message: "HIGH RISK WARNING: Location intersects with known flood data (Wadi Hanifa - Zone B). Recommended deductible increase: 200%.",
                data: { score: 88, factors: ["Flood", "Terrain"] }
            }
        }

        return {
            agentName: "Rommaana Risk Agent",
            message: "Standard Risk Profile. Location is within a developed industrial zone with adequate drainage.",
            data: { score: 35, factors: ["Secure"] }
        }
    }
}

export const ComplianceAgent = {
    checkRegulations: async (type: string, docs: string[]): Promise<AgentResponse> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock check on document completeness

        return {
            agentName: "Rommaana Compliance Agent",
            message: "All IA Mandatory Clauses (Circular 2025/11) are present. KYC is verified via Elm integration. Application is compliant.",
            action: "APPROVED"
        }
    }
}

// Knowledge & Integration Agent (NotebookLM)
export const KnowledgeAgent = {
    answerInquiry: async (query: string): Promise<AgentResponse> => {
        const response = await NotebookLMService.query("al-etihad-knowledge-base", query);
        return {
            agentName: "Rommaana Knowledge Agent",
            message: response.answer,
            data: { sources: response.sources }
        };
    }
};

export class ExtractionAgent {
    static async extractData(text: string): Promise<Record<string, string>> {
        try {
            const prompt = `
                You are a data extraction bot for insurance claims.
                Analyze the following user message and extract any relevant claim data like Date, Time, Location, Vehicle Type, or Damage description.
                Output ONLY a JSON object with keys as field names and values as extracted data.
                Input: "${text}"
            `;

            const res = await fetch("/api/vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const result = await res.json();
            try {
                let jsonText = result.text;
                if (jsonText.includes("```json")) {
                    jsonText = jsonText.split("```json")[1].split("```")[0].trim();
                } else if (jsonText.includes("```")) {
                    jsonText = jsonText.split("```")[1].split("```")[0].trim();
                }
                return JSON.parse(jsonText);
            } catch {
                return {};
            }
        } catch (error) {
            console.error("Extraction error:", error);
            return {};
        }
    }
}
