"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "Admin" | "Insurer" | "B2B_Partner" | "Customer";

interface RoleContextType {
    role: Role;
    setRole: (role: Role) => void;
    // Helper booleans for easy checking
    isAdmin: boolean;
    isInsurer: boolean;
    isB2B: boolean;
    isCustomer: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<Role>("Admin"); // Default to Admin for now

    useEffect(() => {
        const savedRole = localStorage.getItem("rommaana-role") as Role;
        if (savedRole && ["Admin", "Insurer", "B2B_Partner", "Customer"].includes(savedRole)) {
            setRoleState(savedRole);
        }
    }, []);

    const setRole = (newRole: Role) => {
        setRoleState(newRole);
        localStorage.setItem("rommaana-role", newRole);
    };

    const value = {
        role,
        setRole,
        isAdmin: role === "Admin",
        isInsurer: role === "Insurer",
        isB2B: role === "B2B_Partner",
        isCustomer: role === "Customer",
    };

    return (
        <RoleContext.Provider value={value}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
}
