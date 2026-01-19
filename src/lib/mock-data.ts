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
    video?: string;
    statement: string;
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
        statement: "I was rear-ended at a traffic light. The other driver accepted full liability. Just need the bumper fixed.",
        image: "/images/claims/volvo_bumper.png",
        gallery: [
            "/images/claims/volvo_bumper.png",
            "/images/claims/volvo_pristine.png",
            "/images/claims/volvo_scratch.png",
            "/images/claims/volvo_rear.png"
        ],
        video: "https://v.ftcdn.net/04/96/12/57/700_F_496125791_qNpS8iEwI5qS8I8uF8yS6n6P8U6W8A2W_ST.mp4"
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
        statement: "Hit a bollard in the parking lot. It was dark and I didn't see it. Front bumper and headlight are smashed.",
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
        statement: "Pipe burst under the kitchen sink while I was at work. Came home to a flooded kitchen.",
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
        statement: "lost control on the highway due to oil spill. Car spun out and hit the barrier. Airbags deployed.",
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
        statement: "Scraped the side against a pillar in the underground parking. Minor cosmetic damage.",
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
        statement: "Cargo shifted during transit and crushed the goods. Driver reports evasive maneuver caused the shift.",
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
        statement: "Rock chip on the highway cracked the windshield. Need replacement.",
        image: "https://images.unsplash.com/photo-1605332211603-911b33342375?w=800&auto=format&fit=crop", // Keep ID 7 as is (quota limit)
        gallery: ["https://images.unsplash.com/photo-1605332211603-911b33342375?w=800&auto=format&fit=crop"]
    }
];
