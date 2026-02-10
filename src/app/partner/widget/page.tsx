"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesGrowthWidget } from "@/components/sales-growth-widget";
import { AdminHeader } from "@/components/admin-header";
import { Code, Copy, ExternalLink, ShieldCheck, Zap, Play, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { NotebookLMService } from "@/lib/notebooklm-service";

export default function PartnerWidgetPage() {
    const { t } = useTranslation();
    const [testResult, setTestResult] = useState<string | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const runBridgeTest = async () => {
        setIsTesting(true);
        setTestResult(null);
        try {
            // Real query to the Al Etihad knowledge base via the bridge
            const response = await NotebookLMService.query("al-etihad-knowledge-base", "What is the annual premium for the Home Shield plan?");
            setTestResult(response.answer);
        } catch (error: any) {
            setTestResult(`Connection Failed: ${error.message}`);
        } finally {
            setIsTesting(false);
        }
    };

    const embedCode = `<!-- Rommaana Sales Growth Widget -->
<script src="https://platform.rommaana.sa/widget.js" async></script>
<rommaana-sales-widget 
    partner-id="sales-growth-123" 
    insurer="al-etihad" 
    theme="premium-dark">
</rommaana-sales-widget>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        alert("Embed code copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            <AdminHeader />

            <main className="flex-1 container mx-auto p-12 max-w-5xl">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#be123c]/5 rounded-full text-[#be123c] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <Zap className="w-3 h-3 fill-current" /> B2B Partner Portal
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                        Sales Growth <span className="text-[#be123c]">Widget</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl">
                        Empower your apps with Al Etihad's real-time product intelligence. Embed our sovereign AI assistant in seconds.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <Card className="rounded-[2.5rem] border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <CardHeader className="bg-slate-900 text-white p-8">
                                <CardTitle className="flex items-center gap-3">
                                    <Code className="w-6 h-6 text-[#be123c]" /> Quick Integration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <p className="text-sm text-slate-500 mb-6 font-medium">
                                    Copy and paste this snippet into the <code>&lt;body&gt;</code> of your website or app.
                                </p>
                                <div className="bg-slate-50 rounded-2xl p-6 relative group border border-slate-100">
                                    <pre className="text-xs font-mono text-slate-700 leading-relaxed overflow-x-auto">
                                        {embedCode}
                                    </pre>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={copyToClipboard}
                                        className="absolute top-4 right-4 hover:bg-[#be123c]/10 text-[#be123c] rounded-xl"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-[2.5rem] border-slate-200 shadow-lg shadow-slate-200/30 overflow-hidden">
                            <CardHeader className="bg-white border-b p-8">
                                <CardTitle className="flex items-center gap-3 text-slate-900">
                                    <Zap className="w-6 h-6 text-[#be123c]" /> Bridge Diagnostics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <p className="text-sm text-slate-500 mb-6 font-medium">
                                    Verify the status of the Rommaana AI integration bridge (NotebookLM).
                                </p>

                                <Button
                                    onClick={runBridgeTest}
                                    disabled={isTesting}
                                    className="w-full h-12 bg-[#be123c] hover:bg-black rounded-xl font-black gap-2 transition-all active:scale-95"
                                >
                                    {isTesting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> RUNNING BRIDGE...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 fill-current" /> RUN INTEGRATION BRIDGE
                                        </>
                                    )}
                                </Button>

                                {testResult && (
                                    <div className={`mt-6 p-4 rounded-2xl border flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${testResult.includes("Error") || testResult.includes("Failed")
                                        ? "bg-rose-50 border-rose-100 text-rose-700"
                                        : "bg-emerald-50 border-emerald-100 text-emerald-700"
                                        }`}>
                                        {testResult.includes("Error") || testResult.includes("Failed") ? (
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5 shrink-0" />
                                        )}
                                        <div className="text-xs font-bold leading-relaxed">
                                            <p className="uppercase tracking-widest text-[10px] mb-1 opacity-70">Diagnostic Output:</p>
                                            {testResult}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="relative pt-12 h-content">
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#be123c]/5 rounded-full blur-[100px] -z-10" />
                        <div className="bg-white rounded-[3rem] p-12 lg:p-16 border border-slate-200 shadow-premium relative">
                            <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Try the Demo</h3>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                Interact with the Al Etihad Sales Assistant in the bottom right corner.
                                <br /><br />
                                <span className="text-[#be123c] font-black italic">Tip:</span> Ask about "Cheapest options" or "Elite coverage".
                            </p>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Live Widget Active</p>
                            </div>

                            <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white">
                                <ShieldCheck className="w-10 h-10 text-[#be123c] mb-6" />
                                <h4 className="text-lg font-black mb-2">Partner Security</h4>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                                    The Nexus Key ensures that only authorized domains render this widget. Data resides in GCC.
                                </p>
                                <Button variant="ghost" className="text-white hover:bg-white/10 p-0 h-auto font-bold text-xs gap-2">
                                    Security Docs <ExternalLink className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <SalesGrowthWidget />
        </div>
    );
}

