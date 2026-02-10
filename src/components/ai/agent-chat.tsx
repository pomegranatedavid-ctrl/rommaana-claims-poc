'use client';

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";
import { voiceAIService } from "@/services/voice/voice-ai-service";

export type AgentType = 'claims' | 'policy' | 'support' | 'compliance';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AgentChatProps {
    agentType: AgentType;
    agentName?: string; // Optional override
    conversationId?: string;
    onClose?: () => void;
    onReasoning?: (reasoning: string) => void;
    onLoading?: (isLoading: boolean) => void;
}

const agentInfo: Record<AgentType, { name: string; description: string; color: string }> = {
    claims: {
        name: 'Claims Agent',
        description: 'Submit and track insurance claims',
        color: 'bg-blue-600',
    },
    policy: {
        name: 'Policy Agent',
        description: 'Get quotes and manage policies',
        color: 'bg-green-600',
    },
    support: {
        name: 'Support Agent',
        description: 'General help and inquiries',
        color: 'bg-purple-600',
    },
    compliance: {
        name: 'Compliance Agent',
        description: 'Regulatory compliance guidance',
        color: 'bg-orange-600',
    },
};

export function AgentChat({ agentType, agentName, conversationId = 'demo', onClose, onReasoning, onLoading }: AgentChatProps) {
    const { language } = useTranslation();
    const info = agentInfo[agentType];
    const displayName = agentName || info.name;

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: language === 'ar'
                ? `مرحباً بك في ${displayName}. كيف يمكنني مساعدتك اليوم؟`
                : `Welcome to ${displayName}. How can I assist you today?`,
            timestamp: new Date(),
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Voice AI Handling
    const toggleListening = () => {
        if (isListening) {
            voiceAIService.stopListening();
            setIsListening(false);
        } else {
            setIsListening(true);
            voiceAIService.startListening(
                (text, isFinal) => {
                    setInput(text);
                    if (isFinal) {
                        setIsListening(false);
                        handleSend(text);
                    }
                },
                (error) => {
                    console.error("Voice Error:", error);
                    setIsListening(false);
                },
                () => setIsListening(false),
                language === 'ar' ? 'ar' : 'en'
            );
        }
    };

    const toggleSpeaking = (text: string) => {
        if (isSpeaking) {
            voiceAIService.stopSpeaking();
            setIsSpeaking(false);
        } else {
            setIsSpeaking(true);
            voiceAIService.speak(text, language === 'ar' ? 'ar' : 'en', () => setIsSpeaking(false));
        }
    };

    const handleSend = async (textRaw?: string) => {
        const text = textRaw || input;
        if (!text.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);
        if (onLoading) onLoading(true);

        try {
            const response = await fetch('/api/ai/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentType,
                    message: text,
                    conversationId,
                    language: language === 'ar' ? 'ar' : 'en',
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();

            if (data.response.reasoning && onReasoning) {
                onReasoning(data.response.reasoning);
            }

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response.message,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMsg]);

        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: language === 'ar' ? 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.' : 'Sorry, something went wrong. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
            if (onLoading) onLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className={cn("p-4 flex items-center justify-between text-white", info.color)}>
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{displayName}</h3>
                        <p className="text-xs opacity-90">{info.description}</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full h-8 w-8">
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                        {/* Avatar */}
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user' ? "bg-slate-200" : info.color
                        )}>
                            {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-white" />}
                        </div>

                        {/* Bubble */}
                        <div className={cn(
                            "relative max-w-[80%] rounded-2xl p-4 text-sm shadow-sm",
                            msg.role === 'user'
                                ? "bg-slate-900 text-white rounded-tr-none"
                                : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        )}>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                            <div className="mt-1 flex items-center justify-between gap-4">
                                <span className="text-[10px] opacity-70">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => toggleSpeaking(msg.content)}
                                        className="opacity-50 hover:opacity-100 transition-opacity"
                                        title={isSpeaking ? "Stop speaking" : "Read aloud"}
                                    >
                                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", info.color)}>
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("shrink-0", isListening && "text-red-500 bg-red-50 animate-pulse")}
                        onClick={toggleListening}
                        title={isListening ? "Stop listening" : "Start voice input"}
                    >
                        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>

                    <Input
                        placeholder={isListening ? (language === 'ar' ? "جارٍ الاستماع..." : "Listening...") : (language === 'ar' ? "كتب رسالتك..." : "Type a message...")}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        disabled={isLoading}
                        className="flex-1"
                    />

                    <Button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        size="icon"
                        className={cn("shrink-0 hover:opacity-90 transition-colors", info.color)}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
