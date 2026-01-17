"use client";

import React from "react";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Zap, Shield, Globe, Terminal, ArrowRight, Share2, Layers } from "lucide-react";

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <AdminHeader />

            <main className="flex-1 container mx-auto p-8 max-w-6xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        The Rommaana <span className="text-[#be123c]">API Nexus</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-3xl">
                        Our B2B platform connects your existing systems to Rommaana's agentic AI mesh.
                        Automate underwriting, claims, and growth through a single secure gateway.
                    </p>
                </div>

                {/* Visual Nexus Diagram (CSS-Based) */}
                <section className="mb-16">
                    <div className="relative bg-slate-900 rounded-[2rem] p-12 overflow-hidden shadow-2xl border border-slate-800">
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-20">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#be123c] rounded-full blur-[120px]"></div>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                            {/* Left Side: Partners */}
                            <div className="space-y-6">
                                <PartnerNode name="Core Insurance System" />
                                <PartnerNode name="B2B Broker Portal" />
                                <PartnerNode name="Mobile Claimant App" />
                            </div>

                            {/* Center: Nexus Hub */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#be123c] rounded-full blur-2xl opacity-40 animate-pulse"></div>
                                    <div className="w-32 h-32 bg-slate-800 border-2 border-[#be123c] rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(190,18,60,0.4)]">
                                        <Network className="w-16 h-16 text-[#be123c]" />
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <h3 className="text-white font-bold text-xl tracking-wider">ROMMAANA HUB</h3>
                                    <div className="text-[#be123c] text-[10px] font-bold uppercase tracking-[0.3em] mt-1">API Nexus v4.2</div>
                                </div>
                            </div>

                            {/* Right Side: Agents */}
                            <div className="space-y-6">
                                <AgentNode label="Vision Mesh" desc="Damage Analysis" />
                                <AgentNode label="Risk Guardian" desc="Compliance Check" />
                                <AgentNode label="Sales Copilot" desc="Pitch Generation" />
                            </div>

                            {/* Connecting Lines (Simplified Representation) */}
                            <div className="hidden md:block absolute top-1/2 left-[30%] right-[30%] h-[2px] bg-gradient-to-r from-transparent via-[#be123c]/50 to-transparent -translate-y-1/2"></div>
                        </div>
                    </div>
                </section>

                {/* Technical Breakdown */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
                                <Terminal className="w-5 h-5 text-[#be123c]" /> Integration Endpoints
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                <EndpointRow method="POST" endpoint="/v1/claims/analyze" desc="Vision-based damage assessment" />
                                <EndpointRow method="GET" endpoint="/v1/risk/underwrite" desc="SAMA-compliant score retrieval" />
                                <EndpointRow method="POST" endpoint="/v1/sales/nudge" desc="Real-time sentiment-based pitch" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" /> Enterprise Security
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Every API request is secured with HMAC-SHA256 signatures and mutual TLS. Partners get dedicated 'Nexus Keys' that isolate data within their sovereign instances.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" /> Real-time Mesh
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Our API doesn't just return data; it triggers a mesh of AI agents that collaborate to solve complex underwriting or claims tasks in milliseconds.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm mb-20">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Integrate?</h2>
                    <p className="text-slate-500 mb-8 max-w-xl mx-auto">
                        Get your API credentials and start building on top of Saudi Arabia's most advanced insurance intelligence platform.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-[#be123c] hover:bg-[#9f0f32] px-8 rounded-full">Explore API Docs</Button>
                        <Button size="lg" variant="outline" className="px-8 rounded-full">Contact Support</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

function PartnerNode({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-[#be123c]/50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                <Globe className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-xs font-medium text-slate-300">{name}</span>
        </div>
    );
}

function AgentNode({ label, desc }: { label: string; desc: string }) {
    return (
        <div className="flex items-center gap-4 bg-[#be123c]/5 p-4 rounded-xl border border-[#be123c]/10 hover:bg-[#be123c]/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#be123c] flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
                <div className="text-xs font-bold text-white uppercase tracking-tighter">{label}</div>
                <div className="text-[10px] text-[#be123c] font-medium">{desc}</div>
            </div>
        </div>
    );
}

function EndpointRow({ method, endpoint, desc }: { method: string; endpoint: string; desc: string }) {
    return (
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {method}
                </span>
                <code className="text-xs font-mono text-slate-800 font-bold">{endpoint}</code>
            </div>
            <span className="text-xs text-slate-400 font-medium italic">{desc}</span>
        </div>
    );
}
