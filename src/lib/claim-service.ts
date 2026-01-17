"use client";

import { Claim, MOCK_CLAIMS } from "./mock-data";

const STORAGE_KEY = "rommaana_claims";

export const ClaimService = {
    getClaims: (): Claim[] => {
        if (typeof window === "undefined") return MOCK_CLAIMS;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            // Initialize with mock data if empty
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CLAIMS));
            return MOCK_CLAIMS;
        }
        return JSON.parse(stored);
    },

    addClaim: (claim: Claim) => {
        if (typeof window === "undefined") return;
        const claims = ClaimService.getClaims();
        const updated = [claim, ...claims];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Dispatch custom event for real-time-ish update if on same browser session
        window.dispatchEvent(new Event("claims-updated"));
    },

    reset: () => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CLAIMS));
        window.dispatchEvent(new Event("claims-updated"));
    }
};
