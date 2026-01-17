export interface Claim {
    id: string;
    policyHolder: string;
    date: string;
    type: string;
    status: "Pending" | "Approved" | "Review";
    aiConfidence: number;
    aiPrediction: "Approve" | "Reject" | "Flag";
    damageEstimate: string;
    image: string;
    gallery: string[];
}

export const MOCK_CLAIMS: Claim[] = [
    {
        id: "CLM-2026-001",
        policyHolder: "Ahmed Al-Saud",
        date: "2026-05-20",
        type: "Motor - Collision",
        status: "Pending",
        aiConfidence: 98,
        aiPrediction: "Approve",
        damageEstimate: "SAR 1,200",
        image: "/images/minor-scratch.png",
        gallery: ["/images/minor-scratch.png"]
    },
    {
        id: "CLM-2026-002",
        policyHolder: "Sara Khalid",
        date: "2026-05-21",
        type: "Motor - Frontal",
        status: "Review",
        aiConfidence: 45,
        aiPrediction: "Flag",
        damageEstimate: "SAR 15,000",
        image: "/images/severe-crash.png",
        gallery: ["/images/severe-crash.png"]
    },
    {
        id: "CLM-2026-003",
        policyHolder: "Tech Corp Ltd",
        date: "2026-05-22",
        type: "Property - Water",
        status: "Pending",
        aiConfidence: 89,
        aiPrediction: "Approve",
        damageEstimate: "SAR 4,500",
        image: "/images/water-damage.png",
        gallery: ["/images/water-damage.png"]
    }
];
