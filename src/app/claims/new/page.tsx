"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Send,
    Upload,
    Shield,
    CheckCircle,
    AlertTriangle,
    Loader2,
    ArrowLeft,
    MessageSquare,
    Camera,
    ClipboardCheck,
    FileText,
    ChevronRight,
    ChevronLeft,
    Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { VisionAgent, FraudAgent, DecisionAgent, ExtractionAgent } from "@/lib/agents";
import { ClaimService } from "@/lib/claim-service";
import { Claim } from "@/lib/mock-data";
import { useTranslation } from "@/context/language-context";

type Message = {
    id: string;
    sender: "user" | "agent";
    content: React.ReactNode;
    timestamp: Date;
};

export default function ClaimsChatPage() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "agent",
            content: t("claims.chat_prompt"),
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [claimStage, setClaimStage] = useState<"INTAKE" | "ANALYSIS" | "DECISION">("INTAKE");
    const [extractedData, setExtractedData] = useState<Record<string, string>>({});
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle responsiveness
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = (sender: "user" | "agent", content: React.ReactNode) => {
        setMessages((prev) => [
            ...prev,
            { id: Math.random().toString(), sender, content, timestamp: new Date() },
        ]);
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isProcessing) return;
        const userText = inputValue;
        setInputValue("");
        addMessage("user", userText);
        setIsProcessing(true);

        // 1. Live Extraction
        ExtractionAgent.extractData(userText).then(data => {
            if (Object.keys(data).length > 0) {
                setExtractedData(prev => ({ ...prev, ...data }));
                // Automatically open sidebar on first extraction if on desktop
                if (!isMobile && !isSidebarOpen) setIsSidebarOpen(true);
            }
        });

        // 2. Chat Logic
        if (claimStage === "INTAKE") {
            setTimeout(() => {
                addMessage("agent", "I've noted those details. Do you have any photos of the damage? You can upload them here.");
                setIsProcessing(false);
            }, 1000);
        } else {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
        setExtractedData(prev => ({ ...prev, "Document Evidence": file.name }));

        // UI Interaction
        addMessage("user", <div className="flex items-center gap-2"><div className="w-16 h-16 bg-slate-200 rounded-md overflow-hidden"><img src={imageUrl} alt="upload" className="w-full h-full object-cover" /></div> <span>Uploaded: {file.name}</span></div>);
        setClaimStage("ANALYSIS");
        setIsProcessing(true);

        try {
            // Get the last user message to use as context for the vision agent
            const lastUserMessage = [...messages].reverse().find(m => m.sender === "user");
            const statementContext = typeof lastUserMessage?.content === 'string' ? lastUserMessage.content : "";

            // 1. Vision Agent
            addMessage("agent", <div className="flex items-center gap-2 text-[#be123c] font-bold"><Loader2 className="animate-spin w-4 h-4" /> {t("claims.analyzing")}</div>);
            const visionResult = await VisionAgent.analyzeImage(file, statementContext);

            // Extract vision details to sidebar
            if (visionResult.data?.parts) {
                setExtractedData(prev => ({
                    ...prev,
                    "Detected Damage": visionResult.data.parts.join(", "),
                    "Damage Severity": `${visionResult.data.damageScore || 0}/100`
                }));
            }
            addMessage("agent", visionResult.message);

            // 2. Fraud & Decision Flow
            addMessage("agent", <div className="flex items-center gap-2 text-[#be123c] font-bold"><Loader2 className="animate-spin w-4 h-4" /> Verifying Policy Alignment...</div>);

            const provenanceResult = await FraudAgent.verifyImageProvenance(file.name);
            const fraudResult = await FraudAgent.checkHistory("GUEST_USER");
            const worstFraudData = provenanceResult.data?.riskLevel === "CRITICAL" ? provenanceResult.data : fraudResult.data;

            const decisionResult = await DecisionAgent.makeDecision(visionResult.data, worstFraudData);

            setIsProcessing(false);
            setClaimStage("DECISION");

            // 3. Register Record
            const registrationItem: Claim = {
                id: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
                policyHolder: "Guest User",
                date: new Date().toISOString().split('T')[0],
                type: "Motor - Collision",
                status: decisionResult.action === "APPROVED" ? "Approved" : "Review",
                aiConfidence: 95,
                aiPrediction: decisionResult.action === "APPROVED" ? "Approve" : "Flag",
                damageEstimate: decisionResult.data?.damageScore ? `SAR ${decisionResult.data.damageScore * 100}` : "SAR 1,200",
                image: imageUrl,
                gallery: [imageUrl],
                statement: Object.entries(extractedData).map(([k, v]) => `${k}: ${v}`).join(" | ")
            };

            // Supabase Call
            ClaimService.addClaim(registrationItem).catch(err => {
                console.error("Submission failed:", err);
                // We keep it silent for UI unless we want to show a small toast
            });

            // 4. Render Decision Card
            addMessage("agent", (
                <Card className={cn("mt-4 border-l-4 overflow-hidden", decisionResult.action === "APPROVED" ? "border-l-green-500" : "border-l-amber-500")}>
                    <div className="bg-slate-50 px-4 py-2 border-b flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Shield className="w-3 h-3 text-[#be123c]" /> Regulatory Compliance
                        </span>
                        {decisionResult.data?.regulatoryNote && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                {decisionResult.data.regulatoryNote}
                            </span>
                        )}
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            {decisionResult.action === "APPROVED" ? <CheckCircle className="text-green-600" /> : <AlertTriangle className="text-amber-600" />}
                            <h3 className="font-bold text-lg">{decisionResult.action === "APPROVED" ? "Claim Approved" : "Referral Needed"}</h3>
                        </div>
                        <p className="mb-4 text-sm text-slate-600">{decisionResult.message}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Estimate</p>
                                <p className="font-bold text-[#be123c]">{registrationItem.damageEstimate}</p>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Authority Alignment</p>
                                <p className="font-bold text-slate-700 text-[11px]">{decisionResult.data?.citation || "IA Standard"}</p>
                            </div>
                        </div>

                        {decisionResult.action === "APPROVED" ? (
                            <Button className="w-full bg-green-600 hover:bg-green-700 font-bold uppercase tracking-wider text-xs">Accept Settlement</Button>
                        ) : (
                            <Button variant="outline" className="w-full font-bold uppercase tracking-wider text-xs">Coach me for Advisor Call</Button>
                        )}
                    </div>
                </Card>
            ));
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm h-16">
                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/claims" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#be123c]" /> <span className="hidden sm:inline">Claims Manager</span>
                        </h1>
                        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none hidden sm:block">AI-Powered Adjudication Platform</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[8px] md:text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-1 rounded uppercase flex items-center gap-1">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="hidden xs:inline">Real-time Adjudication</span>
                        <span className="xs:hidden">Live</span>
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative">
                {/* Interaction Space (Left) */}
                <div className={cn(
                    "flex-1 flex flex-col relative bg-[#f1f5f9]/30 transition-all duration-300 min-w-0",
                    isSidebarOpen && !isMobile ? "mr-0" : ""
                )}>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        <AnimatePresence>
                            {messages.map(m => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={cn("flex w-full", m.sender === "user" ? "justify-end" : "justify-start")}
                                >
                                    <div className={cn(
                                        "max-w-[90%] md:max-w-[75%] p-4 rounded-3xl shadow-sm text-sm font-medium",
                                        m.sender === "user"
                                            ? "bg-slate-900 text-white rounded-br-none"
                                            : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                                    )}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isProcessing && (
                            <div className="flex justify-start w-full">
                                <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-bl-none flex items-center gap-2">
                                    <Loader2 className="animate-spin w-4 h-4 text-[#be123c]" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent Processing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-white border-t">
                        <div className="max-w-4xl mx-auto flex items-center gap-2 md:gap-3">
                            <div className="relative flex-1">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Describe your claim..."
                                    className="h-12 md:h-14 bg-slate-50 border-transparent rounded-2xl pl-10 md:pl-12 focus:bg-white focus:ring-2 focus:ring-[#be123c]/20 transition-all border-2 focus:border-[#be123c] text-sm"
                                    disabled={isProcessing}
                                />
                                <MessageSquare className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                            </div>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                className="h-12 w-12 md:h-14 md:w-14 rounded-2xl border-2 border-slate-100 hover:border-[#be123c] hover:bg-rose-50 transition-all p-0 flex items-center justify-center shrink-0"
                                disabled={isProcessing}
                            >
                                <Camera className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                            <Button
                                onClick={handleSend}
                                className="h-12 px-4 md:h-14 md:px-8 bg-[#be123c] hover:bg-rose-800 rounded-2xl shadow-lg shadow-rose-100 font-black uppercase tracking-wider text-xs md:text-sm shrink-0"
                                disabled={!inputValue.trim() || isProcessing}
                            >
                                <span className="hidden sm:inline mr-2">Send</span> <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Evidence Space (Right Panel) */}
                <aside className={cn(
                    "bg-white border-l shadow-2xl z-40 transition-all duration-500 ease-in-out flex flex-col overflow-hidden",
                    isSidebarOpen ? "w-full sm:w-[350px] md:w-[400px]" : "w-0",
                    isMobile ? "absolute inset-y-0 right-0" : "relative"
                )}>
                    {/* Toggle Button for Desktop */}
                    {!isMobile && (
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-md hover:bg-slate-50 z-50 transition-transform hidden lg:block"
                        >
                            {isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    )}

                    <div className="p-4 md:p-6 border-b bg-slate-50/50 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <ClipboardCheck className="w-4 h-4 text-[#be123c]" /> Evidence Summary
                            </h2>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">AUTO-EXTRACTED PARAMETERS</p>
                        </div>
                        {isMobile && (
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        {Object.entries(extractedData).length === 0 ? (
                            <div className="h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center p-6 bg-slate-50/50">
                                <FileText className="w-10 h-10 text-slate-200 mb-2" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 leading-relaxed">Chat with Rommaana to start extracting evidence</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(extractedData).map(([key, value]) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 relative overflow-hidden"
                                    >
                                        <div className="absolute top-1 right-1 opacity-20">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block mb-1">{key}</span>
                                        <p className="text-slate-900 font-bold text-sm leading-tight">{value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {uploadedImage && (
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Visual Proof</span>
                                <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100 bg-slate-100">
                                    <img src={uploadedImage} className="w-full h-auto object-cover max-h-60" alt="Damage proof" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 md:p-6 bg-slate-50 border-t shrink-0">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Local Compliance OK
                                </span>
                            </div>
                            <Button
                                className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95"
                                onClick={() => alert("Reclamación registrada internamente.")}
                            >
                                Submit Documented Claim
                            </Button>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
