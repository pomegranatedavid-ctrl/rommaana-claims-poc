"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, ShieldAlert, Sparkles, ScanEye, Building2, Terminal, Play, Loader2, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisionAgent, FraudAgent, RiskAgent, SalesAgent } from "@/lib/agents";

export default function AgentsPage() {
    const [, setActiveTab] = useState("vision");
    const [consoleOutput, setConsoleOutput] = useState<{ timestamp: string, type: 'info' | 'error' | 'success', message: string, data?: any }[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    // Agent Inputs
    const [visionInput, setVisionInput] = useState("/images/minor-scratch.png"); // Default mock image
    const [fraudInput, setFraudInput] = useState("FRAUD123");
    const [riskLocation, setRiskLocation] = useState("Wadi Hanifa");
    const [riskType, setRiskType] = useState("Warehouse");
    const [salesLead, setSalesLead] = useState("Abdullah Al-Saud");
    const [salesProduct, setSalesProduct] = useState("Comprehensive Motor");

    // Agent Configurations
    const [showSettings, setShowSettings] = useState(false);
    const [visionConfidence, setVisionConfidence] = useState(85);
    const [visionMode, setVisionMode] = useState("Deep Analysis");
    const [fraudSensitivity, setFraudSensitivity] = useState("High");
    const [riskStrictness, setRiskStrictness] = useState("Circular 11/2025");
    const [salesTone, setSalesTone] = useState("Persuasive");

    const log = (message: string, type: 'info' | 'error' | 'success' = 'info', data?: any) => {
        setConsoleOutput(prev => [{
            timestamp: new Date().toLocaleTimeString(),
            type,
            message,
            data
        }, ...prev]);
    };

    const runVisionAgent = async () => {
        setIsRunning(true);
        log(`Initializing Vision Mesh Node (Confidence: ${visionConfidence}%, Mode: ${visionMode})...`, "info");
        try {
            log(`Analyzing image source: ${visionInput}`, "info");
            const result = await VisionAgent.analyzeDetail(visionInput);
            log("Vision Analysis Complete", "success", { ...result, config_used: { visionConfidence, visionMode } });
        } catch (e) {
            log("Vision Agent Error", "error", e);
        } finally {
            setIsRunning(false);
        }
    };

    const runFraudAgent = async () => {
        setIsRunning(true);
        log(`Connecting to Anti-Fraud Ledger (Sensitivity: ${fraudSensitivity})...`, "info");
        try {
            log(`Checking history for User ID: ${fraudInput}`, "info");
            const result = await FraudAgent.checkHistory(fraudInput);
            log(result.message, result.data?.riskLevel === "HIGH" ? "error" : "success", { ...result.data, sensitivity: fraudSensitivity });
        } catch (e) {
            log("Fraud Agent Error", "error", e);
        } finally {
            setIsRunning(false);
        }
    };

    const runRiskAgent = async () => {
        setIsRunning(true);
        log(`Querying Geospatial Risk Database (RuleSet: ${riskStrictness})...`, "info");
        try {
            log(`Assessing risk for ${riskType} at ${riskLocation}`, "info");
            const result = await RiskAgent.assessRisk(riskType, riskLocation);
            log(result.message, result.data?.score > 50 ? "error" : "success", { ...result.data, applied_rules: riskStrictness });
        } catch (e) {
            log("Risk Agent Error", "error", e);
        } finally {
            setIsRunning(false);
        }
    };

    const runSalesAgent = async () => {
        setIsRunning(true);
        log(`Generating sales script with ${salesTone} tone...`, "info");
        try {
            const result = await SalesAgent.generateScript(salesLead, salesProduct);
            log("Script Generated", "success", { script: result.message, tone: salesTone });
        } catch (e) {
            log("Sales Agent Error", "error", e);
        } finally {
            setIsRunning(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <AdminHeader />

            <main className="flex-1 container mx-auto p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Brain className="w-8 h-8 text-[#be123c]" />
                        Rommaana Neural Core
                    </h1>
                    <p className="text-slate-500 font-medium">Test, monitor, and debug the agentic mesh network.</p>
                </div>

                <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                    {/* Left: Agent Selection & Controls */}
                    <div className="col-span-12 lg:col-span-7 flex flex-col overflow-visible">
                        <Tabs defaultValue="vision" className="w-full flex-1 flex flex-col" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 h-14 p-1 rounded-xl mb-6">
                                <TabsTrigger value="vision" className="data-[state=active]:bg-rose-50 data-[state=active]:text-[#be123c] data-[state=active]:border-rose-100 border border-transparent rounded-lg font-bold gap-2">
                                    <ScanEye className="w-4 h-4" /> Vision
                                </TabsTrigger>
                                <TabsTrigger value="fraud" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-100 border border-transparent rounded-lg font-bold gap-2">
                                    <ShieldAlert className="w-4 h-4" /> Fraud
                                </TabsTrigger>
                                <TabsTrigger value="risk" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-100 border border-transparent rounded-lg font-bold gap-2">
                                    <Building2 className="w-4 h-4" /> Risk
                                </TabsTrigger>
                                <TabsTrigger value="sales" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-100 border border-transparent rounded-lg font-bold gap-2">
                                    <Sparkles className="w-4 h-4" /> Sales
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-visible">
                                <TabsContent value="vision" className="mt-0 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                                                <ScanEye className="w-6 h-6 text-[#be123c]" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Vision Mesh</h2>
                                                <p className="text-sm text-slate-500">Computer Vision for Damage Assessment</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className={cn(showSettings && "bg-rose-50 text-[#be123c]")}>
                                            <Sparkles className="w-4 h-4 mr-2" /> {showSettings ? "Hide Config" : "Agent Config"}
                                        </Button>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        {showSettings && (
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="grid gap-2">
                                                    <div className="flex justify-between">
                                                        <Label>Confidence Threshold</Label>
                                                        <span className="text-xs font-bold text-[#be123c]">{visionConfidence}%</span>
                                                    </div>
                                                    <input type="range" min="50" max="99" value={visionConfidence} onChange={(e) => setVisionConfidence(parseInt(e.target.value))} className="accent-[#be123c]" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Analysis Precision</Label>
                                                    <Select value={visionMode} onValueChange={setVisionMode}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Standard">Standard (Fast)</SelectItem>
                                                            <SelectItem value="Deep Analysis">Deep Analysis (Precise)</SelectItem>
                                                            <SelectItem value="VLM 2.0">VLM 2.0 (High Precision)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid gap-2">
                                            <Label>Image Source (Simulated)</Label>
                                            <Select value={visionInput} onValueChange={setVisionInput}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="/images/minor-scratch.png">Scratch Damage (Minor)</SelectItem>
                                                    <SelectItem value="/images/severe-crash.png">Structual Failure (Total Loss)</SelectItem>
                                                    <SelectItem value="/images/water-damage.png">Flood Damage</SelectItem>
                                                    <SelectItem value="/images/wadi-resort.png">Geospatial Aerial</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                            {visionInput ? (
                                                <img src={visionInput} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-slate-400">Select an image to preview</span>
                                            )}
                                        </div>

                                        <Button className="w-full bg-[#be123c] hover:bg-[#9f0f32] h-12 text-lg font-bold" onClick={runVisionAgent} disabled={isRunning}>
                                            {isRunning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                                            Analyze Image
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="fraud" className="mt-0 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                                <ShieldAlert className="w-6 h-6 text-amber-700" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Fraud Guard</h2>
                                                <p className="text-sm text-slate-500">Pattern Recognition & Anomaly Detection</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className={cn(showSettings && "bg-amber-50 text-amber-700")}>
                                            <Sparkles className="w-4 h-4 mr-2" /> {showSettings ? "Hide Config" : "Agent Config"}
                                        </Button>
                                    </div>
                                    <div className="space-y-6">
                                        {showSettings && (
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="grid gap-2">
                                                    <Label>Risk Sensitivity</Label>
                                                    <Select value={fraudSensitivity} onValueChange={setFraudSensitivity}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Low">Low (Permissive)</SelectItem>
                                                            <SelectItem value="Medium">Medium (Balanced)</SelectItem>
                                                            <SelectItem value="High">High (Strict)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label>User ID / Provenance Hash</Label>
                                            <Input
                                                value={fraudInput}
                                                onChange={(e) => setFraudInput(e.target.value)}
                                                placeholder="e.g. FRAUD123 or USER_999"
                                            />
                                            <p className="text-xs text-slate-500">Try 'FRAUD123' to trigger detection.</p>
                                        </div>

                                        <Button className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg font-bold" onClick={runFraudAgent} disabled={isRunning}>
                                            {isRunning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                                            Run Fraud Check
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="risk" className="mt-0 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-blue-700" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Risk Guardian</h2>
                                                <p className="text-sm text-slate-500">Geospatial & Regulatory Logic</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className={cn(showSettings && "bg-blue-50 text-blue-700")}>
                                            <Sparkles className="w-4 h-4 mr-2" /> {showSettings ? "Hide Config" : "Agent Config"}
                                        </Button>
                                    </div>
                                    <div className="space-y-6">
                                        {showSettings && (
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="grid gap-2">
                                                    <Label>Regulatory Strictness</Label>
                                                    <Select value={riskStrictness} onValueChange={setRiskStrictness}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Standard">Standard (IA Base)</SelectItem>
                                                            <SelectItem value="Circular 11/2025">Circular 11/2025 (Strict)</SelectItem>
                                                            <SelectItem value="Regional">Regional Deviations</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label>Location</Label>
                                            <Input
                                                value={riskLocation}
                                                onChange={(e) => setRiskLocation(e.target.value)}
                                            />
                                            <p className="text-xs text-slate-500">Try 'Wadi Hanifa' (High Risk) or 'Riyadh Industrial' (Low Risk).</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Property Type</Label>
                                            <Select value={riskType} onValueChange={setRiskType}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                                                    <SelectItem value="Retail">Retail Store</SelectItem>
                                                    <SelectItem value="Residential">Residential Villa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold" onClick={runRiskAgent} disabled={isRunning}>
                                            {isRunning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                                            Assess Risk
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="sales" className="mt-0 h-full flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                <Sparkles className="w-6 h-6 text-emerald-700" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-800">Sales Copilot</h2>
                                                <p className="text-sm text-slate-500">Generative Scripting & Propensity Scoring</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className={cn(showSettings && "bg-emerald-50 text-emerald-700")}>
                                            <Sparkles className="w-4 h-4 mr-2" /> {showSettings ? "Hide Config" : "Agent Config"}
                                        </Button>
                                    </div>
                                    <div className="space-y-6">
                                        {showSettings && (
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="grid gap-2">
                                                    <Label>Script Narrative Tone</Label>
                                                    <Select value={salesTone} onValueChange={setSalesTone}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Professional">Professional (Informative)</SelectItem>
                                                            <SelectItem value="Persuasive">Persuasive (Sales Focus)</SelectItem>
                                                            <SelectItem value="Urgent">Urgent (Limited Time)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label>Lead Name</Label>
                                            <Input
                                                value={salesLead}
                                                onChange={(e) => setSalesLead(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Product Interest</Label>
                                            <Input
                                                value={salesProduct}
                                                onChange={(e) => setSalesProduct(e.target.value)}
                                            />
                                        </div>
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-bold" onClick={runSalesAgent} disabled={isRunning}>
                                            {isRunning ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                                            Generate Script
                                        </Button>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>

                    {/* Right: Output Console */}
                    <Card className="col-span-12 lg:col-span-5 flex flex-col bg-slate-900 border-none shadow-2xl h-full overflow-hidden">
                        <CardHeader className="bg-slate-950/50 border-b border-white/10 p-4">
                            <CardTitle className="text-white flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                                <Terminal className="w-4 h-4 text-green-500" /> Node Output Stream
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 custom-scrollbar">
                            {consoleOutput.length === 0 && (
                                <div className="text-slate-600 h-full flex flex-col items-center justify-center italic">
                                    <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center mb-4">
                                        <Loader2 className="w-4 h-4" />
                                    </div>
                                    Waiting for agent execution...
                                </div>
                            )}
                            {consoleOutput.map((log, i) => (
                                <div key={i} className={cn(
                                    "p-3 rounded border border-l-4",
                                    log.type === 'info' && "bg-slate-800/50 border-slate-700 border-l-blue-500 text-slate-300",
                                    log.type === 'success' && "bg-emerald-950/30 border-emerald-900/50 border-l-emerald-500 text-emerald-400",
                                    log.type === 'error' && "bg-red-950/30 border-red-900/50 border-l-red-500 text-red-400"
                                )}>
                                    <div className="flex gap-2 text-[10px] opacity-50 mb-1 border-b border-white/5 pb-1">
                                        <span>[{log.timestamp}]</span>
                                        <span className="uppercase">{log.type}</span>
                                    </div>
                                    <p className="whitespace-pre-wrap leading-relaxed">{log.message}</p>
                                    {log.data && (
                                        <pre className="mt-2 bg-black/30 p-2 rounded text-[10px] overflow-x-auto text-slate-400">
                                            {JSON.stringify(log.data, null, 2)}
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-2 bg-slate-950 border-t border-white/10 text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-white text-xs h-6"
                                onClick={() => setConsoleOutput([])}
                            >
                                <StopCircle className="w-3 h-3 mr-1" /> Clear Console
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
