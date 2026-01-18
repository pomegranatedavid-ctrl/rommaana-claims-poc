"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, ShieldAlert, Users, FileText, ArrowRight } from "lucide-react";
import { AdminHeader } from "@/components/admin-header";
import { useTranslation } from "@/context/language-context";

export default function AdminHome() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <AdminHeader />

            <main className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-2">{t("admin_home.title") || "Operational Hub"}</h1>
                <p className="text-slate-500 mb-8">{t("admin_home.subtitle") || "Select an Agentic AI Module to launch."}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Claims Module */}
                    <Card className="hover:shadow-lg transition-all border-t-4 border-t-blue-500 bg-white">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <CardTitle>{t("admin_home.adjuster_title")}</CardTitle>
                            <CardDescription>{t("admin_home.adjuster_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 h-12">
                                {t("admin_home.adjuster_long")}
                            </p>
                            <Link href="/admin/dashboard" className="block">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold flex items-center justify-center gap-2">
                                    {t("common.launch_module")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Sales Module */}
                    <Card className="hover:shadow-lg transition-all border-t-4 border-t-green-500 bg-white">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <CardTitle>{t("admin_home.growth_title")}</CardTitle>
                            <CardDescription>{t("admin_home.growth_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 h-12">
                                {t("admin_home.growth_long")}
                            </p>
                            <Link href="/admin/growth" className="block">
                                <Button className="w-full bg-green-600 hover:bg-green-700 font-bold flex items-center justify-center gap-2">
                                    {t("common.launch_module")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Risk Module */}
                    <Card className="hover:shadow-lg transition-all border-t-4 border-t-amber-500 bg-white">
                        <CardHeader>
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <CardTitle>{t("admin_home.risk_title")}</CardTitle>
                            <CardDescription>{t("admin_home.risk_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 h-12">
                                {t("admin_home.risk_long")}
                            </p>
                            <Link href="/admin/risk" className="block">
                                <Button className="w-full bg-amber-600 hover:bg-amber-700 font-bold flex items-center justify-center gap-2">
                                    {t("common.launch_module")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* AI Agents Module */}
                    <Card className="hover:shadow-lg transition-all border-t-4 border-t-[#be123c] bg-white">
                        <CardHeader>
                            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 text-[#be123c]">
                                <FileText className="w-6 h-6" />
                            </div>
                            <CardTitle>{t("admin_home.agents_title")}</CardTitle>
                            <CardDescription>{t("admin_home.agents_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 h-12">
                                {t("admin_home.agents_long")}
                            </p>
                            <Link href="/admin/agents" className="block">
                                <Button className="w-full bg-[#be123c] hover:bg-[#9f0f32] font-bold flex items-center justify-center gap-2">
                                    {t("common.launch_module")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Users Module */}
                    <Card className="hover:shadow-lg transition-all border-t-4 border-t-slate-800 bg-white">
                        <CardHeader>
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-800">
                                <Users className="w-6 h-6" />
                            </div>
                            <CardTitle>{t("admin_home.users_title")}</CardTitle>
                            <CardDescription>{t("admin_home.users_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 h-12">
                                {t("admin_home.users_long")}
                            </p>
                            <Link href="/admin/users" className="block">
                                <Button className="w-full bg-slate-800 hover:bg-slate-900 font-bold flex items-center justify-center gap-2">
                                    {t("common.launch_module")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}
