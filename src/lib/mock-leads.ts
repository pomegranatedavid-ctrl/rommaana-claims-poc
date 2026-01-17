export interface Lead {
    id: string;
    name: string;
    age: number;
    currentProduct: string;
    suggestedProduct: string;
    buyLikelihood: number;
    reason: string;
    avatar: string;
}

export const MOCK_LEADS: Lead[] = [
    {
        id: "LEAD-101",
        name: "Omar Al-Fahad",
        age: 34,
        currentProduct: "Motor TPL",
        suggestedProduct: "Motor Comprehensive",
        buyLikelihood: 85,
        reason: "Bought a new 2026 model car recently.",
        avatar: "https://i.pravatar.cc/150?u=omar"
    },
    {
        id: "LEAD-102",
        name: "Lina Mahmoud",
        age: 29,
        currentProduct: "None",
        suggestedProduct: "Female Cancer Protection",
        buyLikelihood: 72,
        reason: "Demographic segment matching high adoption rate.",
        avatar: "https://i.pravatar.cc/150?u=lina"
    },
    {
        id: "LEAD-103",
        name: "Dr. Khalid",
        age: 45,
        currentProduct: "SME Health",
        suggestedProduct: "Business Interruption",
        buyLikelihood: 91,
        reason: "Clinic expanded to new branch; high risk exposure.",
        avatar: "https://i.pravatar.cc/150?u=khalid"
    }
];
