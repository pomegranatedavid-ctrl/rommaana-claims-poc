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
        image: "/images/claims/collision_1.png",
        gallery: [
            "/images/claims/collision_1.png",
            "/images/claims/collision_2.png",
            "/images/claims/frontal_2.png" // Added for variety
        ]
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
        image: "/images/claims/frontal_1.png",
        gallery: [
            "/images/claims/frontal_1.png",
            "/images/claims/frontal_2.png"
        ]
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
        image: "/images/claims/water_1.png",
        gallery: [
            "/images/claims/water_1.png",
            "/images/claims/water_2.png"
        ]
    },
    {
        id: "CLM-2026-004",
        policyHolder: "Faisal Al-Otaibi",
        date: "2026-05-23",
        type: "Motor - Total Loss",
        status: "Pending",
        aiConfidence: 99,
        aiPrediction: "Approve",
        damageEstimate: "SAR 85,000",
        image: "/images/claims/frontal_1.png", // Reuse severe frontal damage
        gallery: [
            "/images/claims/frontal_1.png",
            "/images/claims/frontal_2.png",
            "/images/claims/collision_1.png"
        ]
    },
    {
        id: "CLM-2026-005",
        policyHolder: "Mona Abdulaziz",
        date: "2026-05-24",
        type: "Motor - Scrape",
        status: "Pending",
        aiConfidence: 92,
        aiPrediction: "Approve",
        damageEstimate: "SAR 800",
        image: "/images/claims/collision_2.png", // Reuse close-up damage
        gallery: ["/images/claims/collision_2.png"]
    },
    {
        id: "CLM-2026-006",
        policyHolder: "Riyadh Logistics",
        date: "2026-05-25",
        type: "Commercial - Cargo",
        status: "Review",
        aiConfidence: 30,
        aiPrediction: "Flag",
        damageEstimate: "SAR 220,000",
        image: "https://images.unsplash.com/photo-1586528116311-ad861f1c7da6?w=800&auto=format&fit=crop", // Keep ID 6 as is (quota limit)
        gallery: ["https://images.unsplash.com/photo-1586528116311-ad861f1c7da6?w=800&auto=format&fit=crop"]
    },
    {
        id: "CLM-2026-007",
        policyHolder: "Hassan Al-Zahrani",
        date: "2026-05-26",
        type: "Motor - Glass",
        status: "Approved",
        aiConfidence: 100,
        aiPrediction: "Approve",
        damageEstimate: "SAR 450",
        image: "https://images.unsplash.com/photo-1605332211603-911b33342375?w=800&auto=format&fit=crop", // Keep ID 7 as is (quota limit)
        gallery: ["https://images.unsplash.com/photo-1605332211603-911b33342375?w=800&auto=format&fit=crop"]
    }
];
