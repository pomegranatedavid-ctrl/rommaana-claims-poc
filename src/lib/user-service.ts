import { supabase } from "./supabase";
import { Role } from "@/context/role-context";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: 'Active' | 'Inactive';
}

export interface Permission {
    feature: string;
    key: string;
    roles: Role[];
}

const INITIAL_USERS: User[] = [
    { id: "1", name: "Sarah Al-Ghamdi", email: "sarah@rommaana.sa", role: "Admin", status: "Active" },
    { id: "2", name: "Khalid Mansour", email: "khalid@insurer.sa", role: "Insurer", status: "Active" },
    { id: "3", name: "B2B Admin", email: "admin@partner.sa", role: "B2B_Partner", status: "Active" },
    { id: "4", name: "Ahmed B. Customer", email: "ahmed@gmail.com", role: "Customer", status: "Active" },
];

const INITIAL_PERMISSIONS: Permission[] = [
    { feature: "Claims Workbench", key: "claims", roles: ["Admin", "Insurer"] },
    { feature: "Sales Growth", key: "sales", roles: ["Admin", "Insurer", "B2B_Partner"] },
    { feature: "Risk Guardian", key: "risk", roles: ["Admin", "Insurer"] },
    { feature: "AI Agents Center", key: "agents", roles: ["Admin"] },
    { feature: "User Management", key: "users", roles: ["Admin"] },
    { feature: "Edit Claim Data", key: "edit_claims", roles: ["Admin", "Insurer"] },
    { feature: "Approve Payment", key: "approve_payment", roles: ["Admin"] },
];

export const UserService = {
    getUsers: async (): Promise<User[]> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');

        if (error) {
            console.warn("Using mock users (profiles table might not exist):", error.message);
            return INITIAL_USERS;
        }

        return (data || []).map(row => ({
            id: row.id,
            name: row.full_name || row.name,
            email: row.email,
            role: row.role as Role,
            status: row.status as 'Active' | 'Inactive'
        }));
    },

    addUser: async (user: Omit<User, 'id'>) => {
        const { data, error } = await supabase
            .from('profiles')
            .insert([{
                full_name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }])
            .select();

        if (error) {
            console.error("Error adding user to Supabase:", error);
            // Fallback for POC: we don't really have a local state to update here since it's a service
            throw error;
        }
        return data?.[0];
    },

    updateUser: async (user: User) => {
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            })
            .eq('id', user.id);

        if (error) {
            console.error("Error updating user in Supabase:", error);
            throw error;
        }
    },

    deleteUser: async (id: string) => {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting user from Supabase:", error);
            throw error;
        }
    },

    getPermissions: async (): Promise<Permission[]> => {
        // For now, permissions are static in this POC or could be in a 'permissions' table
        return INITIAL_PERMISSIONS;
    }
};
