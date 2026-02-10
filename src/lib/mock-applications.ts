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
        image: "https://images.unsplash.com/photo-1588063282787-fd2b0d7973ba?auto=format&fit=crop&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1579762719461-5cc4b3471ab6?auto=format&fit=crop&w=1200",
            "https://images.unsplash.com/photo-1583360398841-82d87f1d9cc9?auto=format&fit=crop&w=1200"
        ]
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
        riskFactors: ["Flood Zone: Flash Flood Risk (Wadi Floor)", "Historic Najdi Architecture (Old Wiring)", "High Thermal Exposure"],
        image: "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1622329713175-103138f292c7?auto=format&fit=crop&w=1200",
            "https://images.unsplash.com/photo-1590402444582-43d168a4c172?auto=format&fit=crop&w=1200"
        ]
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
        image: "https://images.unsplash.com/photo-1564013798648-ec675aec38d6?auto=format&fit=crop&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200",
            "https://images.unsplash.com/photo-1561501878-aabd67665801?auto=format&fit=crop&w=1200"
        ]
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
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1558618047-3c8c76bbb17e?auto=format&fit=crop&w=1200",
            "https://images.unsplash.com/photo-1581092160607-32d53ee856e6?auto=format&fit=crop&w=1200"
        ]
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
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200"
        ]
    }
];
