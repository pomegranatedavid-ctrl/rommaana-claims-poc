"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { useTranslation } from "@/context/language-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Brain,
    ShieldAlert,
    Sparkles,
    ScanEye,
    Building2,
    Terminal,
    Play,
    Loader2,
    StopCircle,
    Settings2,
    Wrench,
    Coins,
    ClipboardCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisionAgent, FraudAgent, RiskAgent, SalesAgent } from "@/lib/agents";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentsPage() {
    const { t } = useTranslation();
    const [, setActiveTab] = useState("vision");
    const [consoleOutput, setConsoleOutput] = useState<{ id: string, timestamp: string, type: 'info' | 'error' | 'success', message: string, data?: any }[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

    // Workshop Configurator State
    const [workshopConfig, setWorkshopConfig] = useState({
        laborRate: 150,
        paintRate: 550,
        totalLossThreshold: 65,
        partsPrices: {
            bumper: 1200,
            headlight: 850,
            fender: 450,
            hood: 2100
        }
    });

    // Agent Inputs
    const [visionInput, setVisionInput] = useState("/images/minor-scratch.png");
    const [fraudInput, setFraudInput] = useState("FRAUD123");
    const [riskLocation, setRiskLocation] = useState("Wadi Hanifa");
    const [riskType, setRiskType] = useState("Warehouse");
    const [salesLead, setSalesLead] = useState("Abdullah Al-Saud");
    const [salesProduct, setSalesProduct] = useState("Comprehensive Motor");

    // UI States
    const [showSettings, setShowSettings] = useState(false);
    const [showWorkshopConfig, setShowWorkshopConfig] = useState(false);
    const [visionConfidence, setVisionConfidence] = useState(85);
    const [visionMode, setVisionMode] = useState("Deep Analysis");
    const [fraudSensitivity, setFraudSensitivity] = useState("High");
    const [riskStrictness, setRiskStrictness] = useState("Circular 11/2025");
    const [salesTone, setSalesTone] = useState("Persuasive");

    const log = (message: string, type: 'info' | 'error' | 'success' = 'info', data?: any) => {
        setConsoleOutput(prev => [{
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString(),
            type,
            message,
            data
        }, ...prev]);
    };

    const runVisionAgent = async () => {
        setIsRunning(true);
        log(`Initializing Vision Mesh Node (Confidence: ${visionConfidence}%, Mode: ${visionMode})...`, "info");
        log(`Applied Workshop Config: Labor SAR ${workshopConfig.laborRate}/hr, Paint SAR ${workshopConfig.paintRate}/panel`, "info");

        try {
            log(`Analyzing image source: ${visionInput}`, "info");
            const result = await VisionAgent.analyzeDetailSim(visionInput, workshopConfig);
            log("Vision Analysis Complete", "success", { ...result, config_used: { visionConfidence, visionMode, workshopConfig } });
        } catch (e) {
            log("Vision Agent Error", "error", e);
        } finally {
            setIsRunning(false);
        }
    };

    const handlePartPriceChange = (part: string, price: string) => {
        setWorkshopConfig(prev => ({
            ...prev,
            partsPrices: {
                ...prev.partsPrices,
                [part]: parseInt(price) || 0
            }
        }));
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <AdminHeader />

            <main className="flex-1 container mx-auto p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                            <Brain className="w-8 h-8 text-[#be123c]" />
                            Rommaana Neural Core
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Fine-tune the agentic mesh and economic calculation parameters.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-900 text-white font-bold px-3 py-1 rounded-full uppercase tracking-widest ring-4 ring-slate-100">
                            v4.2.0-Production
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <Tabs defaultValue="vision" className="h-full flex flex-col lg:flex-row lg:gap-8" onValueChange={setActiveTab}>
                        <div className="lg:w-72 flex flex-col shrink-0">
                            <div className="mb-4 hidden lg:block">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Logic Node</h3>
                            </div>
                            <TabsList className="grid w-full grid-cols-4 lg:flex lg:flex-col bg-white lg:bg-transparent border lg:border-none border-slate-200 h-14 lg:h-auto p-1 lg:p-0 rounded-xl lg:rounded-none mb-6 lg:mb-0 shadow-sm lg:shadow-none space-y-0 lg:space-y-3">
                                <TabsTrigger value="vision" className="data-[state=active]:bg-rose-50 data-[state=active]:text-[#be123c] lg:data-[state=active]:bg-slate-900 lg:data-[state=active]:text-white lg:data-[state=active]:border-slate-900 lg:justify-start lg:h-16 lg:px-5 lg:shadow-sm border border-transparent rounded-lg lg:rounded-2xl font-bold gap-3 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 lg:group-data-[state=active]:bg-rose-500">
                                        <ScanEye className="w-4 h-4" />
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <div className="text-xs font-black uppercase tracking-tight">Vision Mesh</div>
                                        <div className="text-[9px] opacity-60 font-medium">Visual Adjudication</div>
                                    </div>
                                    <span className="lg:hidden">Vision</span>
                                </TabsTrigger>
                                <TabsTrigger value="fraud" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 lg:data-[state=active]:bg-slate-900 lg:data-[state=active]:text-white lg:data-[state=active]:border-slate-900 lg:justify-start lg:h-16 lg:px-5 lg:shadow-sm border border-transparent rounded-lg lg:rounded-2xl font-bold gap-3 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                        <ShieldAlert className="w-4 h-4" />
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <div className="text-xs font-black uppercase tracking-tight">Fraud Guard</div>
                                        <div className="text-[9px] opacity-60 font-medium">Anomaly Detection</div>
                                    </div>
                                    <span className="lg:hidden">Fraud</span>
                                </TabsTrigger>
                                <TabsTrigger value="risk" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 lg:data-[state=active]:bg-slate-900 lg:data-[state=active]:text-white lg:data-[state=active]:border-slate-900 lg:justify-start lg:h-16 lg:px-5 lg:shadow-sm border border-transparent rounded-lg lg:rounded-2xl font-bold gap-3 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <div className="text-xs font-black uppercase tracking-tight">Risk Guardian</div>
                                        <div className="text-[9px] opacity-60 font-medium">Location Analysis</div>
                                    </div>
                                    <span className="lg:hidden">Risk</span>
                                </TabsTrigger>
                                <TabsTrigger value="sales" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 lg:data-[state=active]:bg-slate-900 lg:data-[state=active]:text-white lg:data-[state=active]:border-slate-900 lg:justify-start lg:h-16 lg:px-5 lg:shadow-sm border border-transparent rounded-lg lg:rounded-2xl font-bold gap-3 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <div className="text-xs font-black uppercase tracking-tight">Sales Copilot</div>
                                        <div className="text-[9px] opacity-60 font-medium">Growth Engine</div>
                                    </div>
                                    <span className="lg:hidden">Sales</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Stats or extra info below sidebar on desktop */}
                            <div className="mt-auto hidden lg:block p-6 bg-slate-900 rounded-[2rem] border border-white/5 shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Core Synchronized</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-slate-500 uppercase">Uptime</span>
                                        <span className="text-white">99.98%</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-slate-500 uppercase">Latency</span>
                                        <span className="text-white">42ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                                {/* Agent Workbench area */}
                                <div className="col-span-12 xl:col-span-7 flex flex-col overflow-y-auto custom-scrollbar bg-white border border-slate-200 rounded-[2.5rem] shadow-sm p-6 md:p-8">
                                    <TabsContent value="vision" className="mt-0 h-full flex flex-col space-y-8 animate-in fade-in duration-300">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm">
                                                    <ScanEye className="w-7 h-7 text-[#be123c]" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Vision Mesh</h2>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Visual Damage & Economic Adjudication</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowWorkshopConfig(!showWorkshopConfig)}
                                                    className={cn("font-bold text-xs uppercase tracking-widest h-10 px-4 rounded-xl transition-all", showWorkshopConfig ? "bg-slate-900 text-white border-slate-900" : "hover:border-[#be123c] hover:text-[#be123c]")}
                                                >
                                                    <Wrench className="w-4 h-4 mr-2" /> Damage Configurator
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setShowSettings(!showSettings)}
                                                    className={cn("h-10 w-10 rounded-xl transition-all", showSettings && "bg-rose-50 text-[#be123c]")}
                                                >
                                                    <Settings2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Workshop Configurator Panel */}
                                        {showWorkshopConfig && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-6"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Coins className="w-4 h-4 text-[#be123c]" />
                                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Rate Card & Policy Config</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Labor Rate (SAR/hr)</Label>
                                                        <Input
                                                            type="number"
                                                            value={workshopConfig.laborRate}
                                                            onChange={(e) => setWorkshopConfig(prev => ({ ...prev, laborRate: parseInt(e.target.value) }))}
                                                            className="font-bold border-2 focus:border-[#be123c] rounded-xl"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Paint Rate (SAR/panel)</Label>
                                                        <Input
                                                            type="number"
                                                            value={workshopConfig.paintRate}
                                                            onChange={(e) => setWorkshopConfig(prev => ({ ...prev, paintRate: parseInt(e.target.value) }))}
                                                            className="font-bold border-2 focus:border-[#be123c] rounded-xl"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Loss Threshold (%)</Label>
                                                        <Input
                                                            type="number"
                                                            value={workshopConfig.totalLossThreshold}
                                                            onChange={(e) => setWorkshopConfig(prev => ({ ...prev, totalLossThreshold: parseInt(e.target.value) }))}
                                                            className="font-bold border-2 focus:border-[#be123c] rounded-xl"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
                                                        Standard Part Prices (SAR)
                                                    </Label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {Object.entries(workshopConfig.partsPrices).map(([part, price]) => (
                                                            <div key={part} className="bg-white p-3 rounded-2xl border border-slate-200">
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">{part}</span>
                                                                <Input
                                                                    type="number"
                                                                    value={price}
                                                                    onChange={(e) => handlePartPriceChange(part, e.target.value)}
                                                                    className="h-8 text-xs font-black border-none bg-slate-50 px-2 rounded-lg"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Agent Settings Panel */}
                                        {showSettings && (
                                            <div className="p-6 bg-rose-50/30 rounded-3xl border border-rose-100 space-y-6 animate-in slide-in-from-top-4">
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <Label className="text-xs font-black uppercase tracking-widest text-[#be123c]">Confidence Threshold</Label>
                                                            <span className="text-sm font-black text-[#be123c]">{visionConfidence}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="50" max="99"
                                                            value={visionConfidence}
                                                            onChange={(e) => setVisionConfidence(parseInt(e.target.value))}
                                                            className="w-full accent-[#be123c]"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Computation Mode</Label>
                                                        <Select value={visionMode} onValueChange={setVisionMode}>
                                                            <SelectTrigger className="h-10 rounded-xl border-2 font-bold"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Standard">Standard (Fast)</SelectItem>
                                                                <SelectItem value="Deep Analysis">Deep Analysis (Precise)</SelectItem>
                                                                <SelectItem value="VLM 2.0">Vision Mesh 2.0 (High Precision)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-600">Vision Simulation Input</Label>
                                                    <Select value={visionInput} onValueChange={setVisionInput}>
                                                        <SelectTrigger className="h-12 rounded-2xl border-2 font-bold shadow-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="/images/minor-scratch.png">Scratch Damage (Minor)</SelectItem>
                                                            <SelectItem value="/images/severe-crash.png">Structual Failure (Total Loss)</SelectItem>
                                                            <SelectItem value="/images/water-damage.png">Flood Damage Case</SelectItem>
                                                            <SelectItem value="/images/wadi-resort.png">Geospatial Aerial Plot</SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    <div className="aspect-[16/10] bg-slate-100 rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center overflow-hidden relative group transition-transform hover:scale-[1.02]">
                                                        {visionInput ? (
                                                            <img src={visionInput} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ScanEye className="w-12 h-12 text-slate-300" />
                                                        )}
                                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Source: {visionInput}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-end">
                                                    <Card className="bg-slate-50 border-none rounded-3xl mb-6">
                                                        <CardContent className="p-6 space-y-4">
                                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Neural Task Queue</h4>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Load Vision Transformer
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Inject Economic Config
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                                                    <div className="w-2 h-2 bg-slate-300 rounded-full" /> Generate Damage Prediction
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>

                                                    <Button
                                                        className="w-full bg-[#be123c] hover:bg-[#9f0f32] h-14 rounded-[1.25rem] text-sm font-black uppercase tracking-widest shadow-lg shadow-rose-100 active:scale-95 transition-all"
                                                        onClick={runVisionAgent}
                                                        disabled={isRunning}
                                                    >
                                                        {isRunning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                                                        Execute Vision Analysis
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="fraud" className="mt-0 h-full flex flex-col space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm">
                                                    <ShieldAlert className="w-7 h-7 text-amber-700" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Fraud Guard</h2>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Anomaly Detection & Pattern Match</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Traditional Fraud UI Content... */}
                                        <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
                                            <p className="text-slate-500 font-bold text-sm">Additional layers available in Enterprise Tier.</p>
                                        </div>
                                    </TabsContent>
                                </div>

                                {/* Right: Output Console */}
                                <div className="col-span-12 xl:col-span-5 flex flex-col h-full overflow-hidden">
                                    <Card className="flex flex-col bg-slate-950 border-none shadow-premium rounded-[2.5rem] h-full overflow-hidden">
                                        <CardHeader className="bg-white/5 border-b border-white/5 p-6">
                                            <CardTitle className="text-white flex items-center justify-between">
                                                <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                                                    <Terminal className="w-4 h-4 text-emerald-400" /> Neural Node stream
                                                </span>
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                                                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1 p-6 overflow-y-auto font-mono text-[11px] space-y-4 custom-scrollbar bg-slate-950">
                                            {consoleOutput.length === 0 && (
                                                <div className="h-full flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
                                                    <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-6 flex-shrink-0 animate-pulse">
                                                        <Brain className="w-8 h-8 text-[#be123c]" />
                                                    </div>

                                                    <h2 className="text-xl font-bold text-white mb-2">{t("dashboard.agents_intro_title")}</h2>
                                                    <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
                                                        {t("dashboard.agents_intro_desc")}
                                                    </p>

                                                    <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-start">
                                                            <h4 className="font-bold text-slate-500 mb-2 uppercase tracking-wider text-[10px]">{t("dashboard.agents_traditional_title")}</h4>
                                                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                                                {t("dashboard.agents_traditional_desc")}
                                                            </p>
                                                        </div>
                                                        <div className="bg-[#be123c]/10 p-6 rounded-2xl border border-[#be123c]/20 text-start border-l-4 border-l-[#be123c]">
                                                            <h4 className="font-bold text-[#be123c] mb-2 uppercase tracking-wider text-[10px]">{t("dashboard.agents_ai_title")}</h4>
                                                            <p className="text-slate-200 text-xs leading-relaxed font-bold">
                                                                {t("dashboard.agents_ai_desc")}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8 flex items-center gap-2 text-slate-600 font-medium">
                                                        <Terminal className="w-3 h-3" />
                                                        <span className="text-[10px] uppercase tracking-widest">Waiting for neural triggers...</span>
                                                    </div>
                                                </div>
                                            )}
                                            {consoleOutput.map((log) => (
                                                <motion.div
                                                    key={log.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={cn(
                                                        "p-4 rounded-2xl border border-l-[6px] transition-all",
                                                        log.type === 'info' && "bg-slate-900/50 border-slate-800 border-l-blue-500 text-slate-400",
                                                        log.type === 'success' && "bg-emerald-950/20 border-emerald-900/30 border-l-emerald-500 text-emerald-400",
                                                        log.type === 'error' && "bg-rose-950/20 border-rose-900/30 border-l-rose-500 text-rose-400"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between text-[9px] font-bold opacity-40 mb-2 border-b border-white/5 pb-2">
                                                        <span className="uppercase tracking-widest">{log.type} // node_01</span>
                                                        <span>{log.timestamp}</span>
                                                    </div>
                                                    <p className="whitespace-pre-wrap leading-relaxed font-bold tracking-tight">{log.message}</p>

                                                    {log.type === 'success' && log.message.includes("Vision Analysis") && log.data && (
                                                        <div className="mt-3 space-y-3">
                                                            <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                                                    <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Analysis Resume</h4>
                                                                </div>
                                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    <div className="space-y-1">
                                                                        <span className="text-[8px] text-emerald-400/40 font-black uppercase tracking-tighter">Damaged Parts</span>
                                                                        <p className="text-xs font-black text-emerald-100">{log.data.parts?.join(", ") || "None Detected"}</p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <span className="text-[8px] text-emerald-400/40 font-black uppercase tracking-tighter">Severity Score</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-xs font-black text-emerald-100">{log.data.damageScore}/100</p>
                                                                            <div className="flex-1 h-1 bg-emerald-900/50 rounded-full overflow-hidden">
                                                                                <div className="h-full bg-emerald-400" style={{ width: `${log.data.damageScore}%` }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1 col-span-2 lg:col-span-1">
                                                                        <span className="text-[8px] text-emerald-400/40 font-black uppercase tracking-tighter">Repair Estimate</span>
                                                                        <p className="text-sm font-black text-white">SAR {log.data.estimatedSAR?.toLocaleString() || "0"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setExpandedLogs(prev => ({ ...prev, [log.id]: !prev[log.id] }))}
                                                                className="h-8 text-[10px] font-black text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-0 gap-2 uppercase tracking-widest"
                                                            >
                                                                {expandedLogs[log.id] ? "- Hide Technical Root" : "+ Details: How it's done"}
                                                            </Button>

                                                            {expandedLogs[log.id] && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    className="bg-black/40 p-4 rounded-xl border border-white/5 text-[10px] text-slate-500 overflow-x-auto custom-scrollbar"
                                                                >
                                                                    <div className="flex items-center gap-2 mb-3 opacity-30">
                                                                        <Terminal className="w-3 h-3" />
                                                                        <span className="text-[8px] font-bold uppercase tracking-widest">Raw Neural Data Stream</span>
                                                                    </div>
                                                                    <pre className="font-mono">{JSON.stringify(log.data, null, 2)}</pre>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {log.data && !(log.type === 'success' && log.message.includes("Vision Analysis")) && (
                                                        <div className="mt-3 bg-black/40 p-3 rounded-xl border border-white/5 text-[10px] text-slate-500 overflow-x-auto">
                                                            <pre className="font-mono">{JSON.stringify(log.data, null, 2)}</pre>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </CardContent>
                                        <div className="p-4 bg-black/20 border-t border-white/5 flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-600 hover:text-white text-[10px] font-black uppercase tracking-widest h-8"
                                                onClick={() => setConsoleOutput([])}
                                            >
                                                <StopCircle className="w-3 h-3 mr-2" /> Flush Terminal Buffer
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
