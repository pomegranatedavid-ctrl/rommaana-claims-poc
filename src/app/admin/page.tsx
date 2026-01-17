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

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Claims Module */}
                    <Card className="hover:shadow-lg transition-all border-t-4 border-t-blue-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <CardTitle>{t("admin_home.adjuster_title") || "Adjuster Workbench"}</CardTitle>
                            <CardDescription>{t("admin_home.adjuster_desc") || "AI-Assisted Claims Processing"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 h-12">
                                {t("admin_home.adjuster_long") || "Automate FNOL, visualize damage with Computer Vision, and approve settlements in seconds."}
                            </p>
                            <Link href="/admin/dashboard" className="block">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                                    {t("common.launch_module") || "Launch Module"} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Sales Module */}
                    <Card className="hover:shadow-lg transition-all border-t-4 border-t-green-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <CardTitle>{t("admin_home.growth_title") || "Rommaana Growth"}</CardTitle>
                            <CardDescription>{t("admin_home.growth_desc") || "Sales Copilot & Lead Scoring"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 h-12">
                                {t("admin_home.growth_long") || "Real-time script generation and propensity modeling to boost conversion rates."}
                            </p>
                            <Link href="/admin/growth" className="block">
                                <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
                                    {t("common.launch_module") || "Launch Module"} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Risk Module */}
                    <Card className="hover:shadow-lg transition-all border-t-4 border-t-amber-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <CardTitle>{t("admin_home.risk_title") || "Risk Guardian"}</CardTitle>
                            <CardDescription>{t("admin_home.risk_desc") || "Underwriting & Compliance"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4 h-12">
                                {t("admin_home.risk_long") || "Geospatial risk mapping and automated regulatory compliance checks (IA Circulars)."}
                            </p>
                            <Link href="/admin/risk" className="block">
                                <Button className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2">
                                    {t("common.launch_module") || "Launch Module"} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}
