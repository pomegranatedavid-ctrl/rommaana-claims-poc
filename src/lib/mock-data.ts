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
        image: "https://images.unsplash.com/photo-1594976612316-9b90703a18b0?w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1594976612316-9b90703a18b0?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1562141989-c5c79ac8f576?w=800&auto=format&fit=crop"
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
        image: "https://images.unsplash.com/photo-1600880218819-38501309f3de?w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1600880218819-38501309f3de?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1580273722747-062d3fd9c951?w=800&auto=format&fit=crop"
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
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop"]
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
        image: "https://images.unsplash.com/photo-1574635606673-8b776a30740a?w=800&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1574635606673-8b776a30740a?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1616422285623-13ff0167c95c?w=800&auto=format&fit=crop"
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
        image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop"]
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
        image: "https://images.unsplash.com/photo-1586528116311-ad861f1c7da6?w=800&auto=format&fit=crop",
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
        image: "https://images.unsplash.com/photo-1605332211603-911b33342375?w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1605332211603-911b33342375?w=800&auto=format&fit=crop"]
    }
];
