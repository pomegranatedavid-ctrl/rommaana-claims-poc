"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ShieldCheck, UserPlus, Edit2, Trash2, Check, X, Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";
import { Role } from "@/context/role-context";

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: 'Active' | 'Inactive';
}

const INITIAL_USERS: User[] = [
    { id: "1", name: "Sarah Al-Ghamdi", email: "sarah@rommaana.sa", role: "Admin", status: "Active" },
    { id: "2", name: "Khalid Mansour", email: "khalid@insurer.sa", role: "Insurer", status: "Active" },
    { id: "3", name: "B2B Admin", email: "admin@partner.sa", role: "B2B_Partner", status: "Active" },
    { id: "4", name: "Ahmed B. Customer", email: "ahmed@gmail.com", role: "Customer", status: "Active" },
];

interface Permission {
    feature: string;
    key: string;
    roles: Role[];
}

const INITIAL_PERMISSIONS: Permission[] = [
    { feature: "Claims Workbench", key: "claims", roles: ["Admin", "Insurer"] },
    { feature: "Sales Growth", key: "sales", roles: ["Admin", "Insurer", "B2B_Partner"] },
    { feature: "Risk Guardian", key: "risk", roles: ["Admin", "Insurer"] },
    { feature: "AI Agents Center", key: "agents", roles: ["Admin"] },
    { feature: "User Management", key: "users", roles: ["Admin"] },
    { feature: "Edit Claim Data", key: "edit_claims", roles: ["Admin", "Insurer"] },
    { feature: "Approve Payment", key: "approve_payment", roles: ["Admin"] },
];

export default function UsersManagementPage() {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [permissions, setPermissions] = useState<Permission[]>(INITIAL_PERMISSIONS);
    const [isEditingUser, setIsEditingUser] = useState<User | null>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);

    // Form states
    const [formData, setFormData] = useState<Partial<User>>({});

    const handleAddUser = () => {
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name || "New User",
            email: formData.email || "",
            role: formData.role || "Customer",
            status: "Active"
        };
        setUsers([...users, newUser]);
        setIsAddingUser(false);
        setFormData({});
    };

    const handleUpdateUser = () => {
        if (!isEditingUser) return;
        setUsers(users.map(u => u.id === isEditingUser.id ? { ...u, ...formData } : u));
        setIsEditingUser(null);
        setFormData({});
    };

    const handleDeleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
    };

    const togglePermission = (key: string, role: Role) => {
        setPermissions(prev => prev.map(p => {
            if (p.key === key) {
                const hasRole = p.roles.includes(role);
                return {
                    ...p,
                    roles: hasRole ? p.roles.filter(r => r !== role) : [...p.roles, role]
                };
            }
            return p;
        }));
    };

    const roles: Role[] = ["Admin", "Insurer", "B2B_Partner", "Customer"];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <AdminHeader />

            <main className="flex-1 container mx-auto p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-[#be123c]" />
                            {t("common.user_management")}
                        </h1>
                        <p className="text-slate-500 font-medium">Manage organization members and role-based access protocols.</p>
                    </div>
                </div>

                <Tabs defaultValue="users" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="bg-white border border-slate-200 h-14 p-1 rounded-xl mb-6 w-fit inline-flex">
                        <TabsTrigger value="users" className="data-[state=active]:bg-rose-50 data-[state=active]:text-[#be123c] rounded-lg font-bold gap-2 px-6">
                            <Users className="w-4 h-4" /> Users
                        </TabsTrigger>
                        <TabsTrigger value="permissions" className="data-[state=active]:bg-rose-50 data-[state=active]:text-[#be123c] rounded-lg font-bold gap-2 px-6">
                            <Lock className="w-4 h-4" /> {t("common.permissions")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="flex-1 overflow-hidden mt-0">
                        <div className="grid grid-cols-12 gap-8 h-full">
                            {/* User List */}
                            <div className={cn("col-span-12 transition-all duration-300", (isAddingUser || isEditingUser) ? "lg:col-span-8" : "lg:col-span-12")}>
                                <Card className="border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                                        <h3 className="font-bold text-slate-800">Active Users ({users.length})</h3>
                                        <Button
                                            size="sm"
                                            className="bg-[#be123c] hover:bg-[#9f0f32] gap-2"
                                            onClick={() => { setIsAddingUser(true); setIsEditingUser(null); setFormData({}); }}
                                        >
                                            <UserPlus className="w-4 h-4" /> Add User
                                        </Button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 sticky top-0 z-10">
                                                <tr className="border-b border-slate-100">
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {users.map((user) => (
                                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-rose-100 group-hover:text-[#be123c] transition-colors">
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={cn(
                                                                "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                                user.role === 'Admin' && "bg-rose-100 text-[#be123c]",
                                                                user.role === 'Insurer' && "bg-blue-100 text-blue-700",
                                                                user.role === 'B2B_Partner' && "bg-amber-100 text-amber-700",
                                                                user.role === 'Customer' && "bg-emerald-100 text-emerald-700",
                                                            )}>
                                                                {user.role.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                <span className="text-xs font-medium text-slate-600">{user.status}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                                                    onClick={() => { setIsEditingUser(user); setFormData(user); setIsAddingUser(false); }}
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>

                            {/* Add/Edit Panel */}
                            {(isAddingUser || isEditingUser) && (
                                <div className="col-span-12 lg:col-span-4 animate-in slide-in-from-right-4 duration-300">
                                    <Card className="border-slate-200 shadow-xl overflow-visible">
                                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-800">
                                                {isAddingUser ? "Create New User" : "Update Profile"}
                                            </h3>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setIsAddingUser(false); setIsEditingUser(null); }}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <CardContent className="p-6 space-y-4">
                                            <div className="grid gap-2">
                                                <Label>Full Name</Label>
                                                <Input
                                                    value={formData.name || ""}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Email Address</Label>
                                                <Input
                                                    value={formData.email || ""}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Access Role</Label>
                                                <Select value={formData.role || ""} onValueChange={(val) => setFormData({ ...formData, role: val as Role })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                        <SelectItem value="Insurer">Insurer Agent</SelectItem>
                                                        <SelectItem value="B2B_Partner">B2B Partner</SelectItem>
                                                        <SelectItem value="Customer">End Customer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="pt-4 flex gap-3">
                                                <Button
                                                    className="flex-1 bg-[#be123c] hover:bg-[#9f0f32] font-bold"
                                                    onClick={isAddingUser ? handleAddUser : handleUpdateUser}
                                                >
                                                    {isAddingUser ? "Create User" : "Save Changes"}
                                                </Button>
                                                <Button variant="outline" className="flex-1 font-bold" onClick={() => { setIsAddingUser(false); setIsEditingUser(null); }}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                                        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            <strong>Security Protocol:</strong> Role changes trigger a mandatory session reset. The user will need to re-authenticate with their new clearance level.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="permissions" className="flex-1 mt-0">
                        <Card className="border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                            <div className="p-6 bg-slate-50 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-lg">Role Access Control Matrix</h3>
                                <p className="text-sm text-slate-500">Configure feature-level granular permissions across Rommaana clearance levels.</p>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-white">
                                            <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white sticky left-0 z-20 w-64 border-r">Feature Module</th>
                                            {roles.map(role => (
                                                <th key={role} className="px-8 py-6 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className={cn(
                                                            "mb-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                            role === 'Admin' && "bg-rose-100 text-[#be123c]",
                                                            role === 'Insurer' && "bg-blue-100 text-blue-700",
                                                            role === 'B2B_Partner' && "bg-amber-100 text-amber-700",
                                                            role === 'Customer' && "bg-emerald-100 text-emerald-700",
                                                        )}>
                                                            {role.replace('_', ' ')}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">Clearance</span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {permissions.map((p) => (
                                            <tr key={p.key} className="group hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-6 bg-white sticky left-0 z-10 border-r group-hover:bg-slate-50 transition-colors">
                                                    <p className="text-sm font-bold text-slate-800">{p.feature}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">module_id: {p.key}</p>
                                                </td>
                                                {roles.map(role => {
                                                    const hasAccess = p.roles.includes(role);
                                                    return (
                                                        <td key={role} className="px-8 py-6 text-center">
                                                            <div className="flex justify-center">
                                                                <button
                                                                    onClick={() => togglePermission(p.key, role)}
                                                                    className={cn(
                                                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                                        hasAccess
                                                                            ? "bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100"
                                                                            : "bg-slate-50 text-slate-300 border border-slate-100 hover:border-slate-200"
                                                                    )}
                                                                >
                                                                    {hasAccess ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-slate-900 flex justify-between items-center">
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> All changes are logged to the Rommaana Audit Trail.
                                </p>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8">
                                    Apply Global Policy
                                </Button>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
