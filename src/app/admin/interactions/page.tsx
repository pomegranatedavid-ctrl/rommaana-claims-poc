"use client";

import React, { useState, useEffect, useRef } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    MessageSquare,
    Send,
    Settings2,
    RefreshCcw,
    Sparkles,
    User,
    Bot,
    ClipboardCheck,
    ShieldCheck,
    Zap,
    ShoppingBag,
    History,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
    status?: "sending" | "sent" | "error";
}

type InteractionMode = "claims" | "status" | "recommendation" | "upgrade" | "support";

export default function InteractionsPage() {
    const { t, language } = useTranslation();
    const [mode, setMode] = useState<InteractionMode>("claims");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Config states
    const [aiTone, setAiTone] = useState("Empathetic");
    const [complexity, setComplexity] = useState("Advanced");
    const [strictness, setStrictness] = useState("Standard");
    const [autoApprove, setAutoApprove] = useState(false);

    useEffect(() => {
        resetInteraction();
    }, [mode]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const resetInteraction = () => {
        setMessages([
            {
                id: "1",
                role: "ai",
                content: getInitialMessage(mode),
                timestamp: new Date()
            }
        ]);
        setIsTyping(false);
    };

    const getInitialMessage = (m: InteractionMode) => {
        switch (m) {
            case "claims": return "Hello, I'm your AI Claims Assistant. I'm sorry to hear you've had an incident. Could you please describe what happened?";
            case "status": return "Welcome back. I can check the status of your active claims or policies. Please provide your reference number.";
            case "recommendation": return "Hi! Based on your profile, I've found some insurance products that might interest you. Would you like to see a personalized recommendation?";
            case "upgrade": return "It looks like your current 'Starter Motor' policy could be enhanced for better coverage. Shall we explore upgrade options?";
            case "support": return "Hello, how can I help you today? I can assist with policy questions, changes, or general inquiries.";
            default: return "Hello, how can I assist you?";
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
            status: "sent"
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: simulateAIResponse(mode, input),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const simulateAIResponse = (m: InteractionMode, userText: string) => {
        const text = userText.toLowerCase();
        if (m === "claims") {
            if (text.includes("accident") || text.includes("hit")) {
                return "I understand. To process this claim accurately using Rommaana Vision, please upload photos of the damage if you have them, and tell me where this occurred.";
            }
            return "Thank you for the information. I'm initializing our Neural Damage Assessment. Would you like to continue with the visual inspection?";
        }
        if (m === "status") {
            return "I've checked our ledger. Your claim #CLM-RX902 is currently in 'Neural Validation' phase. Estimated completion is in 2 hours.";
        }
        if (m === "recommendation") {
            return "Based on your frequent travel to Europe, I recommend our 'Schengen+ Elite' travel plan. It includes specialized medical coverage and delay protection.";
        }
        return "That's clear. I've noted your request. Is there anything else I can clarify for you within our professional coverage framework?";
    };

    return (
        <div className="h-screen bg-[#f8fafc] flex flex-col overflow-hidden">
            <AdminHeader />

            <main className="flex-1 container mx-auto p-8 max-w-7xl flex flex-col overflow-hidden">
                <div className="shrink-0 mb-6">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-[#be123c]" />
                        {t("common.customer_interactions")}
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Simulate, evaluate, and fine-tune AI-customer touchpoints.</p>
                </div>

                <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
                    {/* Left Panel: Simulator */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col h-full bg-white rounded-3xl shadow-premium border border-slate-200 overflow-hidden relative">
                        {/* Selector Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                            <Tabs value={mode} onValueChange={(v) => setMode(v as InteractionMode)} className="w-full">
                                <TabsList className="grid grid-cols-5 bg-white/50 border border-slate-200 h-10 p-1 rounded-xl">
                                    <TabsTrigger value="claims" className="text-[10px] font-black uppercase tracking-wider gap-2">
                                        <ClipboardCheck className="w-3 h-3" /> Claims
                                    </TabsTrigger>
                                    <TabsTrigger value="status" className="text-[10px] font-black uppercase tracking-wider gap-2">
                                        <History className="w-3 h-3" /> Status
                                    </TabsTrigger>
                                    <TabsTrigger value="recommendation" className="text-[10px] font-black uppercase tracking-wider gap-2">
                                        <ShoppingBag className="w-3 h-3" /> Offer
                                    </TabsTrigger>
                                    <TabsTrigger value="upgrade" className="text-[10px] font-black uppercase tracking-wider gap-2">
                                        <Zap className="w-3 h-3" /> Upgrade
                                    </TabsTrigger>
                                    <TabsTrigger value="support" className="text-[10px] font-black uppercase tracking-wider gap-2">
                                        <MessageSquare className="w-3 h-3" /> Support
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Chat History */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
                        >
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={cn(
                                            "flex items-start gap-4",
                                            msg.role === "user" ? "flex-row-reverse" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                                            msg.role === "ai" ? "bg-[#be123c] text-white" : "bg-slate-900 text-white"
                                        )}>
                                            {msg.role === "ai" ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                        </div>
                                        <div className={cn(
                                            "max-w-[70%] p-5 rounded-2xl shadow-sm relative",
                                            msg.role === "ai"
                                                ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                                                : "bg-[#be123c] text-white rounded-tr-none"
                                        )}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase opacity-40 mt-3 block",
                                                msg.role === "ai" ? "text-slate-400" : "text-rose-200"
                                            )}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-[#be123c] text-white flex items-center justify-center shrink-0">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                            <div className="relative flex gap-3">
                                <Input
                                    placeholder="Type a simulated customer message..."
                                    className="h-14 bg-white border-slate-200 rounded-2xl pl-6 pr-14 font-medium shadow-sm focus:ring-[#be123c]"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                                <Button
                                    className="absolute right-2 top-2 h-10 w-10 bg-[#be123c] hover:bg-[#9f0f32] rounded-xl flex items-center justify-center text-white"
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="mt-3 flex items-center justify-between px-2">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> End-to-End Neural Privacy
                                </p>
                                <Button variant="ghost" size="sm" className="h-6 text-[10px] font-black uppercase text-[#be123c]" onClick={resetInteraction}>
                                    <RefreshCcw className="w-3 h-3 mr-1" /> Reset Scenario
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Settings */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 pb-4">
                        <Card className="border-none shadow-premium bg-white rounded-3xl overflow-hidden shrink-0">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#be123c]/10 rounded-xl flex items-center justify-center text-[#be123c]">
                                        <Settings2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-black tracking-tight">AI Engine Config</CardTitle>
                                        <CardDescription className="text-xs font-bold uppercase tracking-wider">Fine-tune the neural response</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Response Tone</Label>
                                        <Select value={aiTone} onValueChange={setAiTone}>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/30">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Empathetic">Empathetic (Default)</SelectItem>
                                                <SelectItem value="Formal">Formal (Standard)</SelectItem>
                                                <SelectItem value="Concise">Concise (Fast)</SelectItem>
                                                <SelectItem value="Salesy">Growth-Oriented</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Linguistic Complexity</Label>
                                        <Select value={complexity} onValueChange={setComplexity}>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/30">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Basic">Basic (Simple Terms)</SelectItem>
                                                <SelectItem value="Advanced">Advanced (Expert)</SelectItem>
                                                <SelectItem value="Regulatory">Regulatory Code</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Strictness Level</Label>
                                        <Select value={strictness} onValueChange={setStrictness}>
                                            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/30">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Lenient">Lenient (High Approval)</SelectItem>
                                                <SelectItem value="Standard">Standard Balanced</SelectItem>
                                                <SelectItem value="High">High (Fraud Guard Active)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Neural Auto-Approve</p>
                                            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Bypass human review for low-risk</p>
                                        </div>
                                        <div
                                            className={cn(
                                                "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 relative",
                                                autoApprove ? "bg-[#be123c]" : "bg-slate-200"
                                            )}
                                            onClick={() => setAutoApprove(!autoApprove)}
                                        >
                                            <motion.div
                                                className="w-4 h-4 bg-white rounded-full shadow-sm"
                                                animate={{ x: autoApprove ? 24 : 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl mt-4 shadow-lg group">
                                    Save Configuration <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-premium bg-slate-900 text-white rounded-3xl overflow-hidden p-6 relative shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#be123c]/20 blur-3xl rounded-full -mr-10 -mt-10" />
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-400" /> Lab Statistics
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-[10px] font-black uppercase text-slate-400">Total Interactions</span>
                                    <span className="text-xl font-black">1.4k</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-[10px] font-black uppercase text-slate-400">Sentiment Avg</span>
                                    <span className="text-xl font-black text-emerald-400">Positive</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                    <span className="text-[10px] font-black uppercase text-slate-400">AI Trust Score</span>
                                    <span className="text-xl font-black text-[#be123c]">98.2%</span>
                                </div>
                            </div>
                        </Card>

                        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center gap-2 shrink-0">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting Simulation</p>
                            <p className="text-[10px] text-slate-400 leading-tight">Neural core is idling. Start an interaction to see real-time metrics.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    )
}
