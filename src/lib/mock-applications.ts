export interface Application {
    id: string;
    businessName: string;
    type: string;
    location: string;
    riskScore: number;
    complianceStatus: "Pass" | "Fail" | "Warning";
    assetValue: string;
    suggestedPremium: string;
    riskFactors: string[];
    image: string;
    gallery: string[];
}

export const MOCK_APPLICATIONS: Application[] = [
    {
        id: "APP-2026-881",
        businessName: "Al-Riyadh Logistics",
        type: "Commercial Property (Warehouse)",
        location: "South Riyadh Ind. City",
        riskScore: 35,
        complianceStatus: "Pass",
        assetValue: "SAR 12,000,000",
        suggestedPremium: "SAR 45,000",
        riskFactors: ["Fire Sprinkler Certified", "24/7 Security"],
        image: "https://images.unsplash.com/photo-1586528116311-ad861f1c7da6?w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1586528116311-ad861f1c7da6?w=800&auto=format&fit=crop"]
    },
    {
        id: "APP-2026-882",
        businessName: "Wadi Hanifa Resorts",
        type: "Commercial Property (Hotel)",
        location: "Wadi Hanifa, Riyadh",
        riskScore: 88,
        complianceStatus: "Warning",
        assetValue: "SAR 25,000,000",
        suggestedPremium: "SAR 180,000",
        riskFactors: ["Flood Zone: High", "Historic Building (Old Wiring)"],
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop"]
    },
    {
        id: "APP-2026-883",
        businessName: "TechHub Co.",
        type: "Business Interruption",
        location: "Olaya District",
        riskScore: 15,
        complianceStatus: "Pass",
        assetValue: "N/A",
        suggestedPremium: "SAR 12,500",
        riskFactors: ["ISO 27001 Certified"],
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop"]
    },
    {
        id: "APP-2026-884",
        businessName: "Red Sea Refinery",
        type: "Industrial Facility",
        location: "Yanbu Industrial Port",
        riskScore: 62,
        complianceStatus: "Pass",
        assetValue: "SAR 450,000,000",
        suggestedPremium: "SAR 1,200,000",
        riskFactors: ["Coastal Corrosion Risk", "High Automation Level", "Fire Dept On-site"],
        image: "https://images.unsplash.com/photo-1542289947-474aa1c84968?w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1542289947-474aa1c84968?w=800&auto=format&fit=crop"]
    },
    {
        id: "APP-2026-885",
        businessName: "Tuwaiq Mountain Tech",
        type: "Office Complex",
        location: "Qiddiya Development",
        riskScore: 22,
        complianceStatus: "Pass",
        assetValue: "SAR 8,500,000",
        suggestedPremium: "SAR 18,000",
        riskFactors: ["Green Building Certified", "New Construction"],
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
        gallery: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"]
    }
];
