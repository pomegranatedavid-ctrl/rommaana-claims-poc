"use client";

import { supabase } from "./supabase";
import { Lead as MockLead } from "./mock-leads";

export interface Lead extends MockLead { }

export const LeadService = {
    getLeads: async (): Promise<{ leads: Lead[], isFallback: boolean }> => {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('buy_likelihood', { ascending: false });

            if (error) {
                console.error("Supabase Connectivity Error (getLeads):", error);
                const { MOCK_LEADS } = await import("./mock-leads");
                return { leads: MOCK_LEADS, isFallback: true };
            }

            const leads: Lead[] = (data || []).map(row => ({
                id: row.id,
                name: row.name,
                age: row.age,
                currentProduct: row.current_product,
                suggestedProduct: row.suggested_product,
                buyLikelihood: row.buy_likelihood,
                reason: row.reason,
                avatar: row.avatar_url
            }));

            return { leads, isFallback: false };
        } catch (error) {
            console.error("Catastrophic Lead Fetch Failure:", error);
            const { MOCK_LEADS } = await import("./mock-leads");
            return { leads: MOCK_LEADS, isFallback: true };
        }
    }
};
