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
        image: "/images/warehouse-aerial.png",
        gallery: ["/images/warehouse-aerial.png"]
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
        image: "/images/wadi-resort.png",
        gallery: ["/images/wadi-resort.png"]
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
        image: "/images/office-tower.png",
        gallery: ["/images/office-tower.png"]
    }
];
