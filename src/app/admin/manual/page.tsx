"use client";

import React from "react";
import { AdminHeader } from "@/components/admin-header";
import { useTranslation } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BookOpen,
    BrainCircuit,
    TrendingUp,
    ShieldAlert,
    Terminal,
    MousePointerClick,
    FileCheck,
    ShieldCheck
} from "lucide-react";

export default function UserManual() {
    const { t } = useTranslation();

    const sections = [
        {
            title: t("common.claims_workbench"),
            icon: <BrainCircuit className="w-6 h-6 text-[#be123c]" />,
            steps: [
                "Select a pending claim from the Priority Queue on the left.",
                "Review AI Vision analysis of damage evidence photos.",
                "Check cross-correlation for fraud detection and IA/SAMA compliance flags.",
                "Approve for instant auto-settlement or refer for manual legal review."
            ]
        },
        {
            title: t("common.sales_growth"),
            icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
            steps: [
                "Identify high-propensity leads based on demographic and behavioral data.",
                "Launch the Agentic Growth mesh to generate personalized dynamic scripts.",
                "Analyze live vocal sentiment and adjust 'Pivot Options' during the call.",
                "Log customer objections to refine future propensity matching."
            ]
        },
        {
            title: t("common.risk_guardian"),
            icon: <ShieldAlert className="w-6 h-6 text-amber-600" />,
            steps: [
                "Select new insurance applications for underwriting review.",
                "Audit Geospatial analysis of site pixels for physical hazard detection.",
                "Verify ELM and National ID integration via Regulatory Guard.",
                "Review premium logic (Base Premium + AI Risk Loading) and approve log."
            ]
        },
        {
            title: t("common.how_it_works"),
            icon: <Terminal className="w-6 h-6 text-blue-600" />,
            steps: [
                "Access the Rommaana HUB API endpoints for B2B integration.",
                "Manage secure HMAC-SHA256 signatures for sovereign data instances.",
                "Trigger the Real-time Agent Mesh for collaborative intelligence tasks.",
                "Monitor millisecond processing logs via the technical dashboard."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <AdminHeader />

            <main className="p-8 max-w-5xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-sm border border-slate-100 mb-6">
                        <BookOpen className="w-8 h-8 text-[#be123c]" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        {t("profile.user_manual")}
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto italic font-medium">
                        "Your comprehensive guide to mastering the Rommaana intelligence platform."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {sections.map((section, idx) => (
                        <Card key={idx} className="border-none shadow-md overflow-hidden bg-white rounded-[2rem]">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                <CardTitle className="flex items-center gap-4 text-xl font-bold text-slate-800">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                                        {section.icon}
                                    </div>
                                    {section.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <ul className="space-y-4">
                                    {section.steps.map((step, sIdx) => (
                                        <li key={sIdx} className="flex gap-4">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-50 text-[#be123c] flex items-center justify-center text-xs font-bold border border-rose-100">
                                                {sIdx + 1}
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                                {step}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-[#be123c] p-12 rounded-[3rem] text-white text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl" />
                    <h2 className="text-2xl font-bold mb-4 relative z-10">Still have questions?</h2>
                    <p className="text-rose-100 mb-8 relative z-10 font-medium">Contact our specialized enterprise support team for live assistance.</p>
                    <div className="flex justify-center gap-4 relative z-10">
                        <div className="px-6 py-3 bg-white/20 backdrop-blur rounded-full text-sm font-bold flex items-center gap-2">
                            <MousePointerClick className="w-4 h-4" /> Live Portal
                        </div>
                        <div className="px-6 py-3 bg-white/20 backdrop-blur rounded-full text-sm font-bold flex items-center gap-2 text-start">
                            <ShieldCheck className="w-4 h-4" /> Priority SLA
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
