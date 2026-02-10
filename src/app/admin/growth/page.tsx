"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadService, Lead } from "@/lib/lead-service";
import { Phone, TrendingUp, Mic, Sparkles, Search, ChevronRight, User, ShieldAlert, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { SalesAgent } from "@/lib/agents";
import { AdminHeader } from "@/components/admin-header";
import { ImageAnalysisModal } from "@/components/image-analysis-modal";
import { voiceAIService } from "@/services/voice/voice-ai-service";
import { Volume2, VolumeX } from "lucide-react";

import { useTranslation } from "@/context/language-context";

export default function GrowthDashboard() {
    const { t, language } = useTranslation();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isOffline, setIsOffline] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [script, setScript] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [analysisImagePath, setAnalysisImagePath] = useState("");

    // Call Simulation State
    const [isCalling, setIsCalling] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [sentimentScore, setSentimentScore] = useState(92);
    const [vocalStatus, setVocalStatus] = useState("Enthusiastic");
    const [isMuted, setIsMuted] = useState(false);

    React.useEffect(() => {
        const loadLeads = async () => {
            const { leads: data, isFallback } = await LeadService.getLeads();
            setLeads(data);
            setIsOffline(isFallback);
        };
        loadLeads();
    }, []);

    // Call Ticker Effect
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCalling) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);

                // Randomly fluctuate sentiment
                const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
                setSentimentScore(prev => {
                    const next = prev + fluctuation;
                    return Math.min(99, Math.max(70, next));
                });

                // Update status text based on score
                setVocalStatus(prev => {
                    if (sentimentScore > 90) return "Enthusiastic";
                    if (sentimentScore > 80) return "Engaged";
                    if (sentimentScore > 70) return "Neutral";
                    return "Skeptical";
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCalling, sentimentScore]);

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

    const toggleCall = () => {
        if (!isCalling) {
            setIsCalling(true);
            setCallDuration(0);
            // Start speaking the script
            if (!isMuted && script) {
                voiceAIService.speak(script, (t("common.language_code") as 'en' | 'ar') || (language === 'ar' ? 'ar' : 'en'));
            }
        } else {
            setIsCalling(false);
            voiceAIService.stopSpeaking();
        }
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                    <CardHeader className="border-b bg-white flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="text-[#be123c] w-5 h-5" /> {t("growth.leads_title") || "High Propensity Leads"}
                        </CardTitle>
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border",
                            isOffline ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"
                        )}>
                            {isOffline ? (
                                <ShieldAlert className="w-3 h-3" />
                            ) : (
                                <BrainCircuit className="w-3 h-3" />
                            )}
                            {isOffline ? "OFFLINE (Mock)" : "ONLINE"}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 pt-4">
                        {leads.map((lead) => (
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
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedLead.name}</h2>
                                            {isCalling && (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-lg animate-pulse">
                                                    <div className="w-1.5 h-1.5 bg-rose-600 rounded-full"></div>
                                                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Live {formatDuration(callDuration)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium mb-3">{selectedLead.reason}</p>

                                        {/* Integrated Recording Bar */}
                                        <div className={cn("flex items-center gap-4 text-slate-400 transition-all", isCalling ? "opacity-100" : "opacity-40 grayscale")}>
                                            <div className="flex items-center gap-2 text-[#be123c] font-bold text-[10px] uppercase tracking-tighter shrink-0">
                                                <Mic className={cn("w-4 h-4", isCalling && "animate-pulse")} /> {t("growth.telephony_online") || "Telephony Online"}
                                            </div>
                                            <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden min-w-[120px]">
                                                <div
                                                    className={cn("h-full bg-emerald-500 rounded-full transition-all duration-1000", isCalling ? "opacity-100" : "opacity-30")}
                                                    style={{ width: `${sentimentScore}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                    {t("growth.vocal_sentiment") || "Live Vocal Sentiment"}: {t(`growth.${vocalStatus.toLowerCase()}`) || vocalStatus} ({sentimentScore}%)
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full text-slate-400 hover:text-[#be123c] hover:bg-rose-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newMuted = !isMuted;
                                                        setIsMuted(newMuted);
                                                        if (newMuted) {
                                                            voiceAIService.stopSpeaking();
                                                        } else if (isCalling && script) {
                                                            voiceAIService.speak(script, (t("common.language_code") as 'en' | 'ar') || (language === 'ar' ? 'ar' : 'en'));
                                                        }
                                                    }}
                                                >
                                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="lg"
                                        onClick={toggleCall}
                                        className={cn(
                                            "rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95",
                                            isCalling
                                                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100"
                                                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
                                        )}
                                    >
                                        {isCalling ? (
                                            <><Phone className="w-4 h-4 mr-2 rotate-[135deg]" /> {t("growth.end_call") || "End Call"}</>
                                        ) : (
                                            <><Phone className="w-4 h-4 mr-2" /> {t("growth.start_call") || "Start Call"}</>
                                        )}
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


                        </CardContent>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50/50 text-center overflow-y-auto w-full">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-8 flex-shrink-0 animate-pulse">
                                <TrendingUp className="w-10 h-10 text-[#be123c]" />
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("dashboard.growth_intro_title")}</h2>
                            <p className="text-slate-500 max-w-xl mb-12 text-lg leading-relaxed">
                                {t("dashboard.growth_intro_desc")}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-start transition-all hover:shadow-md">
                                    <h4 className="font-bold text-slate-400 mb-4 uppercase tracking-wider text-xs">{t("dashboard.growth_traditional_title")}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                        {t("dashboard.growth_traditional_desc")}
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl border-l-4 border-l-[#be123c] shadow-sm text-start transition-all hover:shadow-md">
                                    <h4 className="font-bold text-[#be123c] mb-4 uppercase tracking-wider text-xs">{t("dashboard.growth_ai_title")}</h4>
                                    <p className="text-slate-800 text-sm leading-relaxed font-bold">
                                        {t("dashboard.growth_ai_desc")}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center gap-2 text-slate-400 font-medium animate-pulse">
                                <Search className="w-4 h-4" />
                                <span className="text-sm">{t("growth.mesh_standby")}</span>
                            </div>
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}
