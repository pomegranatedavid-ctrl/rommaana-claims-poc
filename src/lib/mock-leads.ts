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
    },
    {
        id: "LEAD-104",
        name: "Mariam Al-Said",
        age: 42,
        currentProduct: "Medical Gold",
        suggestedProduct: "Family Shield +",
        buyLikelihood: 94,
        reason: "Recent marriage and birth of second child.",
        avatar: "https://i.pravatar.cc/150?u=mariam"
    },
    {
        id: "LEAD-105",
        name: "Yousef Bin Jaber",
        age: 55,
        currentProduct: "Home Essential",
        suggestedProduct: "Global Travel Premium",
        buyLikelihood: 68,
        reason: "Frequent flyer miles activity increased by 400%.",
        avatar: "https://i.pravatar.cc/150?u=yousef"
    },
    {
        id: "LEAD-106",
        name: "Fatima Al-Harbi",
        age: 31,
        currentProduct: "Motor Compre",
        suggestedProduct: "IoT Smart Home Bundle",
        buyLikelihood: 88,
        reason: "Recent smart home equipment purchase detected.",
        avatar: "https://i.pravatar.cc/150?u=fatima"
    }
];
