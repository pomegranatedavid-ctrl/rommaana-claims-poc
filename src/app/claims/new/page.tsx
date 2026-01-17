"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Upload, Shield, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisionAgent, FraudAgent, DecisionAgent, AgentResponse } from "@/lib/agents";
import { ClaimService } from "@/lib/claim-service";
import { Claim } from "@/lib/mock-data";

type Message = {
    id: string;
    sender: "user" | "agent";
    content: React.ReactNode;
    timestamp: Date;
};

export default function ClaimsChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "agent",
            content: "Hello! I am Rommaana, your AI Claims Assistant. I hope you are safe. To start your claim, please tell me broadly what happened, or just upload a photo of the damage.",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [claimStage, setClaimStage] = useState<"INTAKE" | "ANALYSIS" | "DECISION">("INTAKE");
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (!inputValue.trim()) return;
        const userText = inputValue;
        setInputValue("");
        addMessage("user", userText);

        // Simple textual reply simulation if not uploading
        if (claimStage === "INTAKE") {
            setIsProcessing(true);
            setTimeout(() => {
                addMessage("agent", "Thank you for the details. To proceed with the assessment, please upload a clear photo of the vehicle damage.");
                setIsProcessing(false);
            }, 1000);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. User Uploads
        addMessage("user", <div className="flex items-center gap-2"><div className="w-16 h-16 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500">Image</div> <span>Uploaded: {file.name}</span></div>);
        setClaimStage("ANALYSIS");
        setIsProcessing(true);

        // 2. Vision Agent
        addMessage("agent", <div className="flex items-center gap-2 text-[#be123c]"><Loader2 className="animate-spin w-4 h-4" /> Analyzing image with Vision Agent...</div>);

        const visionResult = await VisionAgent.analyzeImage(file);
        addMessage("agent", visionResult.message);

        // 3. Fraud Agent (Integrity & History)
        addMessage("agent", <div className="flex items-center gap-2 text-[#be123c]"><Loader2 className="animate-spin w-4 h-4" /> Verifying image provenance...</div>);
        const provenanceResult = await FraudAgent.verifyImageProvenance(file.name);

        if (provenanceResult.data?.riskLevel === "CRITICAL") {
            addMessage("agent", <div className="text-amber-600 font-bold flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {provenanceResult.message}</div>);
        } else {
            addMessage("agent", provenanceResult.message);
        }

        addMessage("agent", <div className="flex items-center gap-2 text-[#be123c]"><Loader2 className="animate-spin w-4 h-4" /> Checking coverage and history...</div>);
        const fraudResult = await FraudAgent.checkHistory("USER123"); // Mock User

        // 4. Decision Agent
        addMessage("agent", <div className="flex items-center gap-2 text-[#be123c]"><Loader2 className="animate-spin w-4 h-4" /> Finalizing decision...</div>);

        // Use the highest risk level from either provenance or history
        const worstFraudData = provenanceResult.data?.riskLevel === "CRITICAL" ? provenanceResult.data : fraudResult.data;
        const decisionResult = await DecisionAgent.makeDecision(visionResult.data, worstFraudData);

        setIsProcessing(false);
        setClaimStage("DECISION");

        // 5. Register Claim (New)
        const newClaim: Claim = {
            id: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
            policyHolder: "Guest User",
            date: new Date().toISOString().split('T')[0],
            type: visionResult.data?.parts?.[0] ? `Motor - ${visionResult.data.parts[0]}` : "Motor - Collision",
            status: decisionResult.action === "APPROVED" ? "Approved" : "Review",
            aiConfidence: Math.floor(80 + Math.random() * 19),
            aiPrediction: decisionResult.action === "APPROVED" ? "Approve" : "Flag",
            damageEstimate: decisionResult.data?.damageScore ? `SAR ${decisionResult.data.damageScore * 100}` : "SAR 1,200",
            image: "/images/minor-scratch.png", // In a real app, this would be the uploaded image's URL
            gallery: ["/images/minor-scratch.png"]
        };
        await ClaimService.addClaim(newClaim);

        // Render Final Decision Card
        addMessage("agent", (
            <Card className={cn("mt-4 border-l-4", decisionResult.action === "APPROVED" ? "border-l-green-500" : "border-l-amber-500")}>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        {decisionResult.action === "APPROVED" ? <CheckCircle className="text-green-600" /> : <AlertTriangle className="text-amber-600" />}
                        <h3 className="font-bold text-lg">{decisionResult.action === "APPROVED" ? "Claim Approved" : "Referral Needed"}</h3>
                    </div>
                    <p className="mb-4">{decisionResult.message}</p>
                    {decisionResult.action === "APPROVED" && (
                        <Button className="w-full bg-green-600 hover:bg-green-700">Accept Settlement</Button>
                    )}
                    {decisionResult.action !== "APPROVED" && (
                        <Button variant="outline" className="w-full">Coach me for Advisor Call</Button>
                    )}
                </div>
            </Card>
        ));

    };


    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#be123c] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">R</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-[#be123c]">Rommaana Claims</h1>
                        <p className="text-xs text-green-600 flex items-center gap-1"><Shield className="w-3 h-3" /> AI Systems Online</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm">Exit</Button>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-full",
                            msg.sender === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[85%] rounded-2xl p-4 shadow-sm",
                                msg.sender === "user"
                                    ? "bg-[#be123c] text-white rounded-br-none"
                                    : "bg-white border border-slate-100 text-slate-800 rounded-bl-none"
                            )}
                        >
                            <div className="text-sm">{msg.content}</div>
                            <div className={cn("text-[10px] mt-1 opacity-70", msg.sender === "user" ? "text-slate-200" : "text-slate-400")}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex justify-start w-full">
                        <div className="bg-white border rounded-2xl p-4 rounded-bl-none flex items-center gap-2 text-slate-500 text-sm">
                            <Loader2 className="animate-spin w-4 h-4" /> Rommaana is typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="bg-white p-4 border-t sticky bottom-0">
                <div className="flex gap-2 items-center max-w-3xl mx-auto">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <Upload className="w-6 h-6 text-slate-500" />
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isProcessing}
                        />
                    </label>
                    <Input
                        className="flex-1 rounded-full border-slate-300 focus-visible:ring-[#be123c] text-slate-900"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={isProcessing}
                    />
                    <Button
                        size="icon"
                        className="rounded-full bg-[#be123c] hover:bg-[#be123c]/90"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isProcessing}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </footer>
        </div>
    );
}
