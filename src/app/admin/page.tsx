"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, ShieldAlert, Users, FileText, ArrowRight, Sparkles } from "lucide-react";
import { AdminHeader } from "@/components/admin-header";
import { useTranslation } from "@/context/language-context";
import { useRole } from "@/context/role-context";
import { cn } from "@/lib/utils";

export default function AdminHome() {
    const { t } = useTranslation();
    const { role } = useRole();

    const modules = [
        {
            id: "claims",
            title: t("admin_home.adjuster_title"),
            desc: t("admin_home.adjuster_desc"),
            long: t("admin_home.adjuster_long"),
            href: "/admin/dashboard",
            icon: BrainCircuit,
            color: "blue",
            roles: ["Admin", "Insurer"]
        },
        {
            id: "sales",
            title: t("admin_home.growth_title"),
            desc: t("admin_home.growth_desc"),
            long: t("admin_home.growth_long"),
            href: "/admin/growth",
            icon: TrendingUp,
            color: "emerald",
            roles: ["Admin", "B2B_Partner"]
        },
        {
            id: "risk",
            title: t("admin_home.risk_title"),
            desc: t("admin_home.risk_desc"),
            long: t("admin_home.risk_long"),
            href: "/admin/risk",
            icon: ShieldAlert,
            color: "amber",
            roles: ["Admin", "Insurer"]
        },
        {
            id: "interactions",
            title: t("common.customer_interactions"),
            desc: "AI Simulator & Lab",
            long: "Test, calibrate, and fine-tune AI-driven customer journeys across Claims, Sales, and Support.",
            href: "/admin/interactions",
            icon: Sparkles,
            color: "indigo",
            roles: ["Admin"]
        },
        {
            id: "agents",
            title: t("admin_home.agents_title"),
            desc: t("admin_home.agents_desc"),
            long: t("admin_home.agents_long"),
            href: "/admin/agents",
            icon: FileText,
            color: "rose",
            roles: ["Admin", "Insurer"]
        },
        {
            id: "users",
            title: t("admin_home.users_title"),
            desc: t("admin_home.users_desc"),
            long: t("admin_home.users_long"),
            href: "/admin/users",
            icon: Users,
            color: "slate",
            roles: ["Admin"]
        },
    ].filter(m => m.roles.includes(role));

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <AdminHeader />

            <main className="container mx-auto px-8 py-12 max-w-7xl">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                        {t("admin_home.title")}
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        {t("admin_home.subtitle")}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((module) => {
                        const Icon = module.icon;

                        const hoverTitleClass = {
                            blue: "group-hover:text-blue-600",
                            emerald: "group-hover:text-emerald-600",
                            amber: "group-hover:text-amber-600",
                            indigo: "group-hover:text-indigo-600",
                            rose: "group-hover:text-[#be123c]",
                            slate: "group-hover:text-slate-800",
                        }[module.color as "blue" | "emerald" | "amber" | "indigo" | "rose" | "slate"];

                        const iconBgClass = {
                            blue: "bg-blue-50 text-blue-600",
                            emerald: "bg-emerald-50 text-emerald-600",
                            amber: "bg-amber-50 text-amber-600",
                            indigo: "bg-indigo-50 text-indigo-600",
                            rose: "bg-rose-50 text-[#be123c]",
                            slate: "bg-slate-100 text-slate-800",
                        }[module.color as "blue" | "emerald" | "amber" | "indigo" | "rose" | "slate"];

                        const descColorClass = {
                            blue: "text-blue-600/70",
                            emerald: "text-emerald-600/70",
                            amber: "text-amber-600/70",
                            indigo: "text-indigo-600/70",
                            rose: "text-[#be123c]/70",
                            slate: "text-slate-800/70",
                        }[module.color as "blue" | "emerald" | "amber" | "indigo" | "rose" | "slate"];

                        const btnHoverClass = {
                            blue: "hover:bg-blue-600",
                            emerald: "hover:bg-emerald-600",
                            amber: "hover:bg-amber-600",
                            indigo: "hover:bg-indigo-600",
                            rose: "hover:bg-[#be123c]",
                            slate: "hover:bg-slate-800",
                        }[module.color as "blue" | "emerald" | "amber" | "indigo" | "rose" | "slate"];

                        return (
                            <Card key={module.id} className="group hover:shadow-2xl transition-all duration-500 border-none bg-white rounded-3xl overflow-hidden shadow-premium">
                                <CardHeader className="pb-4">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500", iconBgClass)}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <CardTitle className={cn("text-2xl font-bold text-slate-900 tracking-tight transition-colors", hoverTitleClass)}>
                                        {module.title}
                                    </CardTitle>
                                    <CardDescription className={cn("font-bold uppercase tracking-widest text-[10px]", descColorClass)}>
                                        {module.desc}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-500 mb-8 leading-relaxed font-medium min-h-[4rem]">
                                        {module.long}
                                    </p>
                                    <Link href={module.href} className="block">
                                        <Button className={cn("w-full bg-slate-900 text-white font-bold h-12 rounded-xl transition-all duration-300 flex items-center justify-center gap-2", btnHoverClass)}>
                                            {t("common.launch_module")} <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
