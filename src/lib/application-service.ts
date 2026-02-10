"use client";

import { supabase } from "./supabase";
import { Application as MockApplication } from "./mock-applications";

export interface Application extends MockApplication { }

export const ApplicationService = {
    getApplications: async (): Promise<{ applications: Application[], isFallback: boolean }> => {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select('*')
                .order('risk_score', { ascending: false });

            if (error) {
                console.error("Supabase Connectivity Error (getApplications):", error);
                const { MOCK_APPLICATIONS } = await import("./mock-applications");
                return { applications: MOCK_APPLICATIONS, isFallback: true };
            }

            const applications: Application[] = (data || []).map(row => ({
                id: row.id,
                businessName: row.business_name,
                type: row.type,
                location: row.location,
                riskScore: row.risk_score,
                complianceStatus: row.compliance_status as "Pass" | "Fail" | "Warning",
                assetValue: row.asset_value,
                suggestedPremium: row.suggested_premium,
                riskFactors: row.risk_factors || [],
                image: row.image_url,
                gallery: row.gallery || []
            }));

            return { applications, isFallback: false };
        } catch (error) {
            console.error("Catastrophic Application Fetch Failure:", error);
            const { MOCK_APPLICATIONS } = await import("./mock-applications");
            return { applications: MOCK_APPLICATIONS, isFallback: true };
        }
    }
};
