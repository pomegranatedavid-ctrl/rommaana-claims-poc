"use client";

import { Claim, MOCK_CLAIMS } from "./mock-data";
import { supabase } from "./supabase";

export const ClaimService = {
    getClaims: async (): Promise<Claim[]> => {
        const { data, error } = await supabase
            .from('claims')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching claims:", error);
            return MOCK_CLAIMS; // Fallback to mock data on error
        }

        if (!data || data.length === 0) {
            return MOCK_CLAIMS; // Fallback to mock data if DB is empty
        }

        // Map DB fields to Claim interface if necessary 
        // (Note: DB uses snake_case, JS uses camelCase)
        return data.map(row => ({
            id: row.id,
            policyHolder: row.policy_holder,
            date: row.date,
            type: row.type,
            status: row.status,
            aiConfidence: row.ai_confidence,
            aiPrediction: row.ai_prediction,
            damageEstimate: row.damage_estimate,
            image: row.image_url,
            gallery: row.gallery || []
        }));
    },

    addClaim: async (claim: Claim) => {
        const { error } = await supabase
            .from('claims')
            .insert([{
                id: claim.id,
                policy_holder: claim.policyHolder,
                date: claim.date,
                type: claim.type,
                status: claim.status,
                ai_confidence: claim.aiConfidence,
                ai_prediction: claim.aiPrediction,
                damage_estimate: claim.damageEstimate,
                image_url: claim.image,
                gallery: claim.gallery
            }]);

        if (error) {
            console.error("Error adding claim:", error);
            throw error;
        }

        // Custom events can still be used for local UI updates, 
        // but Supabase Realtime is the "real" way to do this.
        window.dispatchEvent(new Event("claims-updated"));
    },

    exportToSQL: async () => {
        const { data, error } = await supabase.from('claims').select('*');
        if (error) throw error;

        let sql = `-- Rommaana Export SQL\n-- Table: claims\n\n`;

        data.forEach(row => {
            const values = Object.values(row).map(v =>
                v === null ? 'NULL' :
                    Array.isArray(v) ? `ARRAY['${v.join("','")}']` :
                        typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
            ).join(', ');

            sql += `INSERT INTO claims (${Object.keys(row).join(', ')}) VALUES (${values});\n`;
        });

        const blob = new Blob([sql], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rommaana_export_${new Date().toISOString().split('T')[0]}.sql`;
        a.click();
    }
};
