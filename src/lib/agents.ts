export type ClaimStatus = 'ANALYZING' | 'APPROVED' | 'REFERRED_TO_HUMAN' | 'REJECTED';

export interface AgentResponse {
    agentName: string;
    message: string;
    action?: ClaimStatus;
    data?: any;
}

// Simulated Vision Agent (Computer Vision)
export const VisionAgent = {
    analyzeImage: async (imageName: string): Promise<AgentResponse> => {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock Logic: If filename contains "severe", it's a total loss.
        if (imageName.toLowerCase().includes("severe")) {
            return {
                agentName: "Rommaana Vision Agent",
                message: "I have analyzed the image. I detect severe structural damage to the front chassis. This looks like a potential total loss.",
                data: { damageScore: 95, parts: ["Chassis", "Engine Block", "Bumper"] }
            };
        }

        return {
            agentName: "Rommaana Vision Agent",
            message: "I have analyzed the image. I detect minor cosmetic damage to the rear bumper and quarter panel. It seems repairable.",
            data: { damageScore: 15, parts: ["Rear Bumper", "Quarter Panel"] }
        };
    },

    analyzeDetail: async (imagePath: string): Promise<{ detection: string; relevance: string }> => {
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (imagePath.includes("scratch")) {
            return {
                detection: "Linear abrasions with paint transfer and slight indentation on the polyurethane substrate.",
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
            if (imagePath.includes("scratch")) return "Based on the body lines and tail light signature, this is a white Tesla Model 3. It appears to be a 2021-2023 refresh model.";
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
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (fraudData.riskLevel === "HIGH" || fraudData.riskLevel === "CRITICAL") {
            return {
                agentName: "Rommaana Decision Agent",
                message: fraudData.riskLevel === "CRITICAL"
                    ? "Integrity Shield triggered. Suspicious image origin detected. Immediate referral to Underwriting Investigations."
                    : "Due to historical risk flags, I am referring this claim to a Senior Adjuster.",
                action: "REFERRED_TO_HUMAN",
                data: { reason: fraudData.fraudType || "Historical Risk" }
            };
        }

        if (visionData.damageScore > 80) {
            return {
                agentName: "Rommaana Decision Agent",
                message: "The damage is extensive. I have authorized a Total Loss settlement offer of SAR 45,000 based on the vehicle market value.",
                action: "APPROVED"
            };
        }

        return {
            agentName: "Rommaana Decision Agent",
            message: "The damage is minor. I have authorized an Instant Repair Approval at our partner workshop 'Al-Futtaim Body Shop'. Estimated Cost: SAR 1,200.",
            action: "APPROVED"
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
