"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_APPLICATIONS, Application } from "@/lib/mock-applications";
import { ShieldAlert, FileCheck, MapPin, Search, CheckCircle, AlertTriangle, Building2, Gavel, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskAgent, ComplianceAgent } from "@/lib/agents";
import { AdminHeader } from "@/components/admin-header";
import { ImageAnalysisModal } from "@/components/image-analysis-modal";

import { useTranslation } from "@/context/language-context";

export default function RiskDashboard() {
    const { t } = useTranslation();
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [riskAssessment, setRiskAssessment] = useState<{ message: string, score: number } | null>(null);
    const [complianceCheck, setComplianceCheck] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [analysisImagePath, setAnalysisImagePath] = useState("");

    const handleImageClick = (path: string) => {
        setAnalysisImagePath(path);
        setIsAnalysisModalOpen(true);
    };

    const handleSelectApp = async (app: Application) => {
        setSelectedApp(app);
        setRiskAssessment(null);
        setComplianceCheck(null);
        setIsAnalyzing(true);

        const [riskRes, compRes] = await Promise.all([
            RiskAgent.assessRisk(app.type, app.location),
            ComplianceAgent.checkRegulations(app.type, [])
        ]);

        setRiskAssessment({
            message: riskRes.message,
            score: riskRes.data?.score || 0
        });
        setComplianceCheck(compRes.message);
        setIsAnalyzing(false);
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <AdminHeader />

            {/* Analysis Modal */}
            <ImageAnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                imagePath={analysisImagePath}
                title={selectedApp?.businessName || "Analysis"}
            />

            <main className="flex-1 container mx-auto p-8 grid grid-cols-12 gap-8 h-[calc(100vh-64px)]">

                {/* Left Panel: Applications Queue */}
                <Card className="col-span-4 flex flex-col shadow-md border-slate-200 overflow-hidden">
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileCheck className="text-[#be123c] w-5 h-5" /> {t("risk.underwriting_queue") || "Underwriting Queue"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 pt-4">
                        {MOCK_APPLICATIONS.map((app) => (
                            <div
                                key={app.id}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md group",
                                    selectedApp?.id === app.id ? "border-[#be123c] bg-rose-50/30" : "border-slate-50 bg-white"
                                )}
                                onClick={() => handleSelectApp(app)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 group-hover:text-[#be123c] transition-colors">{app.businessName}</h4>
                                    {app.riskScore > 50 && (
                                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{t("risk.high_risk") || "High Risk"}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                    <MapPin className="w-3 h-3 text-slate-400" /> {app.location}
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{app.type}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#be123c] transition-colors" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Right Panel: Underwriting Workbench */}
                <Card className="col-span-8 shadow-md border-slate-200 flex flex-col overflow-hidden">
                    {selectedApp ? (
                        <CardContent className="p-0 flex flex-col h-full overflow-y-auto pb-8">
                            <div className="p-8 border-b bg-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedApp.businessName}</h2>
                                    <p className="text-slate-500 text-sm font-medium">{t("risk.asset_value") || "Asset Value"}: {selectedApp.assetValue} • {t("risk.target_premium") || "Target Premium"}: {selectedApp.suggestedPremium}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="border-slate-200 text-slate-600">{t("risk.request_survey") || "Request Survey"}</Button>
                                    <Button className="bg-[#be123c] hover:bg-[#9f0f32] text-white font-bold">{t("risk.approve_sama") || "Approve & SAMA Log"}</Button>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-2 gap-8">
                                {/* Risk Map Section */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm mb-4">
                                            <MapPin className="w-4 h-4 text-slate-400" /> {t("risk.geospatial_analysis") || "GEOSPATIAL ANALYSIS"}
                                        </h3>
                                        <div
                                            className="aspect-square bg-slate-100 rounded-2xl border-2 border-slate-100 relative overflow-hidden group cursor-zoom-in shadow-sm"
                                            onClick={() => handleImageClick(selectedApp.image)}
                                        >
                                            <img
                                                src={selectedApp.image}
                                                alt="Geospatial Analysis"
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold text-slate-800 flex items-center gap-2 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                                    <Search className="w-4 h-4 text-[#be123c]" /> {t("risk.analyze_pixel") || "Analyze Site Pixel"}
                                                </div>
                                            </div>

                                            {/* Overlay Zone */}
                                            {selectedApp.riskScore > 50 ? (
                                                <div className="absolute top-4 left-4">
                                                    <div className="bg-red-600/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm flex items-center gap-2 animate-pulse">
                                                        <ShieldAlert className="w-3 h-3" /> {t("risk.hazard_detected") || "HAZARD DETECTED"}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" /> {t("risk.safe_zone") || "SAFE ZONE"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Inspection Gallery */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">{t("risk.ground_inspection") || "Ground-Level Inspection"}</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedApp.gallery?.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleImageClick(img)}
                                                    className="aspect-video rounded-xl overflow-hidden border-2 border-slate-100 cursor-zoom-in hover:border-[#be123c] transition-all group relative"
                                                >
                                                    <img src={img} alt={`Ground View ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Search className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* AI Agents Output */}
                                <div className="space-y-6">
                                    <div className={cn("p-6 rounded-2xl border-2", selectedApp.riskScore > 50 ? "bg-red-50/50 border-red-100" : "bg-emerald-50/50 border-emerald-100")}>
                                        <h3 className={cn("font-bold flex items-center gap-2 mb-4 text-sm", selectedApp.riskScore > 50 ? "text-red-800" : "text-emerald-800")}>
                                            <ShieldAlert className="w-5 h-5" /> {t("risk.risk_underwriter") || "Risk Underwriter (AI)"}
                                        </h3>
                                        {isAnalyzing ? (
                                            <div className="flex items-center gap-3 text-slate-400 italic text-sm">
                                                <Loader2 className="w-4 h-4 animate-spin" /> {t("risk.processing_satellite") || "Processing satellite topology..."}
                                            </div>
                                        ) : (
                                            <p className={cn("text-sm leading-relaxed font-medium italic border-l-2 pl-4", selectedApp.riskScore > 50 ? "text-red-700 border-red-200" : "text-emerald-700 border-emerald-200")}>
                                                "{riskAssessment?.message}"
                                            </p>
                                        )}
                                    </div>

                                    <div className="p-6 rounded-2xl border-2 bg-blue-50/50 border-blue-100">
                                        <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-4 text-sm">
                                            <Gavel className="w-5 h-5 text-blue-600" /> {t("risk.regulatory_guard") || "Regulatory Guard"}
                                        </h3>
                                        {isAnalyzing ? (
                                            <div className="flex items-center gap-3 text-slate-400 italic text-sm">
                                                <Loader2 className="w-4 h-4 animate-spin" /> {t("risk.verifying_ia") || "Verifying IA Compliance..."}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-sm text-blue-900 leading-relaxed font-medium">
                                                    {complianceCheck}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-700 bg-blue-100/50 p-2 rounded-lg">
                                                    <Building2 className="w-3 h-3" /> {t("risk.elm_verified") || "ELM INTEGRATION VERIFIED"}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">{t("risk.premium_logic") || "Premium Logic"}</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">{t("risk.base_premium") || "Base Premium"}</span>
                                                <span className="font-bold text-slate-800">{selectedApp.suggestedPremium}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500">{t("risk.risk_loading") || "Risk Loading"}</span>
                                                <span className={cn("font-bold", selectedApp.riskScore > 50 ? "text-red-600" : "text-emerald-600")}>
                                                    {selectedApp.riskScore > 50 ? "+45% (Catastrophe)" : "-10% (Mitigation)"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 flex-col bg-slate-50/50">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                                <MapPin className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="font-bold text-slate-600 mb-1">{t("risk.select_application") || "Select An Application"}</h3>
                            <p className="text-xs text-slate-400 font-medium">{t("risk.awaiting_trigger") || "Awaiting manual underwriting review trigger"}</p>
                        </div>
                    )}
                </Card>

            </main>
        </div>
    );
}
