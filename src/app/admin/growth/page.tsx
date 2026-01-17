"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_LEADS, Lead } from "@/lib/mock-leads";
import { Phone, TrendingUp, Mic, Sparkles, Search, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SalesAgent } from "@/lib/agents";
import { AdminHeader } from "@/components/admin-header";
import { ImageAnalysisModal } from "@/components/image-analysis-modal";

import { useTranslation } from "@/context/language-context";

export default function GrowthDashboard() {
    const { t } = useTranslation();
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [script, setScript] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [analysisImagePath, setAnalysisImagePath] = useState("");

    const handleImageClick = (path: string) => {
        setAnalysisImagePath(path);
        setIsAnalysisModalOpen(true);
    };

    const handleSelectLead = async (lead: Lead) => {
        setSelectedLead(lead);
        setIsGenerating(true);
        const output = await SalesAgent.generateScript(lead.name, lead.suggestedProduct);
        setScript(output.message);
        setIsGenerating(false);
    }

    const handleObjection = async () => {
        if (!selectedLead) return;
        setIsGenerating(true);
        const output = await SalesAgent.generateScript(selectedLead.name, selectedLead.suggestedProduct, "expensive");
        setScript(output.message);
        setIsGenerating(false);
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <AdminHeader />

            {/* Analysis Modal */}
            <ImageAnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                imagePath={analysisImagePath}
                title={selectedLead?.name || "Analysis"}
            />

            <main className="flex-1 container mx-auto p-8 grid grid-cols-12 gap-8 h-[calc(100vh-64px)]">

                {/* Left Panel: Leads List */}
                <Card className="col-span-4 flex flex-col shadow-md border-slate-200 overflow-hidden">
                    <CardHeader className="border-b bg-white">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="text-[#be123c] w-5 h-5" /> {t("growth.leads_title") || "High Propensity Leads"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 pt-4">
                        {MOCK_LEADS.map((lead) => (
                            <div
                                key={lead.id}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md group",
                                    selectedLead?.id === lead.id ? "border-[#be123c] bg-rose-50/30" : "border-slate-50 bg-white"
                                )}
                                onClick={() => handleSelectLead(lead)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 group-hover:text-[#be123c] transition-colors">{lead.name}</h4>
                                    <span className="bg-[#be123c]/10 text-[#be123c] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                        {lead.buyLikelihood}% {t("growth.match") || "Match"}
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{t("growth.current") || "Current"}: {lead.currentProduct}</div>
                                <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 tracking-tighter">{t("growth.opportunity") || "Opportunity"}</div>
                                        <div className="text-[11px] font-bold text-slate-700">{lead.suggestedProduct}</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#be123c] transition-transform" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Right Panel: Sales Cockpit */}
                <Card className="col-span-8 shadow-md border-slate-200 flex flex-col relative overflow-hidden">
                    {selectedLead ? (
                        <CardContent className="p-0 flex flex-col h-full overflow-y-auto">
                            {/* Header Info */}
                            <div className="p-8 flex justify-between items-center border-b bg-white">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-sm cursor-zoom-in group relative"
                                        onClick={() => handleImageClick(selectedLead.avatar)}
                                    >
                                        <img
                                            src={selectedLead.avatar}
                                            alt={selectedLead.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Search className="w-5 h-5 text-white shadow-lg shadow-black/20 scale-90 group-hover:scale-100 transition-transform" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedLead.name}</h2>
                                        <p className="text-slate-500 text-sm font-medium">{selectedLead.reason}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="lg" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-100 transition-all hover:scale-105 active:scale-95">
                                        <Phone className="w-4 h-4 mr-2" /> {t("growth.start_call") || "Start Call"}
                                    </Button>
                                </div>
                            </div>

                            {/* AI Script Section */}
                            <div className="p-8 flex-1 space-y-6">
                                <h3 className="font-bold text-[#be123c] flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase">
                                    <Sparkles className="w-4 h-4" /> {t("growth.personalized_pitch") || "Personalized Dynamic Pitch"}
                                </h3>

                                <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[2rem] text-xl leading-relaxed text-slate-700 shadow-inner relative italic">
                                    <div className="absolute -top-3 left-8 bg-white px-3 py-1 rounded-full border text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t("growth.processing_mesh") || "Rommaana Voice Processing Mesh"}</div>
                                    {isGenerating ? (
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <div className="w-2 h-2 rounded-full bg-[#be123c] animate-ping"></div>
                                            {t("growth.analyzing_behavior") || "Analyzing customer behavior & historical affinity..."}
                                        </div>
                                    ) : (
                                        `"${script}"`
                                    )}
                                </div>

                                {/* Objection Handlers */}
                                <div className="mt-8">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-[0.15em] border-l-2 border-slate-200 pl-2">{t("growth.sentiment_pivot") || "Sentiment Pivot Options"}</p>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-[#be123c]/30 transition-colors" onClick={handleObjection} disabled={isGenerating}>
                                            "Price is too high"
                                        </Button>
                                        <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-[#be123c]/30" disabled>
                                            "Competition is cheaper"
                                        </Button>
                                        <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-[#be123c]/30" disabled>
                                            "Need more coverage"
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Recording Bar (Visual) */}
                            <div className="p-6 bg-slate-50/50 border-t flex items-center gap-6 text-slate-400 mt-auto">
                                <div className="flex items-center gap-2 text-[#be123c] font-bold text-[10px] uppercase tracking-tighter">
                                    <Mic className="w-4 h-4 animate-pulse" /> {t("growth.telephony_online") || "Telephony Online"}
                                </div>
                                <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-emerald-500 rounded-full"></div>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{t("growth.vocal_sentiment") || "Live Vocal Sentiment"}: {t("growth.enthusiastic") || "Enthusiastic"} (92%)</span>
                            </div>

                        </CardContent>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 flex-col bg-slate-50/50">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                                <TrendingUp className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="font-bold text-slate-600 mb-1">{t("growth.select_lead") || "Select A Lead"}</h3>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{t("growth.mesh_standby") || "Sales Agentic Mesh standby"}</p>
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}
