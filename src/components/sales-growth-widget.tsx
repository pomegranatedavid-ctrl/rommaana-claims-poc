"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Sparkles, X, Bot } from "lucide-react";
import { KnowledgeAgent } from "@/lib/agents";

export function SalesGrowthWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: "Hello! I'm the Al Etihad Sales Assistant. How can I help you with our Home Insurance products today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const response = await KnowledgeAgent.answerInquiry(userMsg);
            setMessages(prev => [...prev, { role: 'bot', text: response.message }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to the knowledge base." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {!isOpen ? (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full bg-[#be123c] hover:bg-black shadow-2xl transition-all hover:scale-110 active:scale-95 group"
                >
                    <MessageSquare className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
                </Button>
            ) : (
                <Card className="w-[400px] h-[500px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-slate-200 animate-in slide-in-from-bottom-5 duration-300 rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-[#be123c] text-white p-6 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-black">Sales Growth</CardTitle>
                                <p className="text-[10px] font-bold text-rose-200 uppercase tracking-widest">Powered by Rommaana AI</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full">
                            <X className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-slate-900 text-white rounded-tr-none'
                                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                    <div className="w-1.5 h-1.5 bg-[#be123c] rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-[#be123c] rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1.5 h-1.5 bg-[#be123c] rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <div className="p-4 bg-white border-t flex gap-2">
                        <Input
                            placeholder="Ask about Al Etihad products..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="rounded-xl border-slate-200 focus-visible:ring-[#be123c]"
                        />
                        <Button size="icon" onClick={handleSend} className="bg-[#be123c] hover:bg-black rounded-xl shrink-0">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
