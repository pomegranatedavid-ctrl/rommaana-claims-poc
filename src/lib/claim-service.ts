"use client";

import { Claim, MOCK_CLAIMS } from "./mock-data";
import { supabase } from "./supabase";

export const ClaimService = {
    getClaims: async (): Promise<{ claims: Claim[], isFallback: boolean }> => {
        try {
            const { data, error } = await supabase
                .from('claims')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase Connectivity Error (getClaims):", error);
                // If it's still appearing as {}, let's try to force inspect it
                console.group("Detailed Error Inspection");
                console.log("Error Name:", error.name);
                console.log("Error Message:", error.message);
                console.log("Error Code:", error.code);
                console.log("Error Details:", error.details);
                console.groupEnd();

                return { claims: MOCK_CLAIMS, isFallback: true };
            }

            // Explicitly type dbClaims to enforce checking against Claim interface
            const dbClaims: Claim[] = (data || []).map(row => ({
                id: row.id,
                policyHolder: row.policy_holder,
                date: row.date,
                type: row.type,
                status: row.status,
                aiConfidence: row.ai_confidence,
                aiPrediction: row.ai_prediction,
                damageEstimate: row.damage_estimate,
                image: row.image_url,
                gallery: row.gallery || [],
                video: row.video_url,
                statement: row.statement || "No statement provided."
            }));

            // Merge logic: Live DB claims first, then unique Mock claims
            const combined = [...dbClaims];
            MOCK_CLAIMS.forEach(mock => {
                if (!combined.some(c => c.id === mock.id)) {
                    combined.push(mock as Claim);
                }
            });

            return { claims: combined, isFallback: false };
        } catch (catastrophicError: any) {
            console.error("Catastrophic Supabase Failure:", catastrophicError);
            return { claims: MOCK_CLAIMS, isFallback: true };
        }
    },

    addClaim: async (claim: Claim) => {
        const claimData = {
            id: claim.id,
            policy_holder: claim.policyHolder,
            date: claim.date,
            type: claim.type,
            status: claim.status,
            ai_confidence: claim.aiConfidence,
            ai_prediction: claim.aiPrediction,
            damage_estimate: claim.damageEstimate,
            image_url: claim.image,
            gallery: claim.gallery || [],
            video_url: claim.video || null,
            statement: claim.statement || "No statement provided."
        };

        const { error } = await supabase
            .from('claims')
            .insert([claimData]);

        if (error) {
            console.error("Supabase Connectivity Error (addClaim):", {
                message: error.message,
                details: error.details,
                fullError: JSON.stringify(error, null, 2)
            });
            throw error;
        }

        // Custom events can still be used for local UI updates, 
        // but Supabase Realtime is the "real" way to do this.
        window.dispatchEvent(new Event("claims-updated"));
    },

    updateClaimGallery: async (claimId: string, gallery: string[]) => {
        const { error } = await supabase
            .from('claims')
            .update({ gallery })
            .eq('id', claimId);

        if (error) {
            console.error("Supabase Connectivity Error (updateClaimGallery):", {
                message: error.message,
                details: error.details,
                fullError: JSON.stringify(error, null, 2)
            });
            throw error;
        }

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
