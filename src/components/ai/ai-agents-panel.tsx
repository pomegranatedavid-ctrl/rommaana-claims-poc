'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentChat } from '@/components/ai/agent-chat';
import { Bot, FileText, Shield, HeadphonesIcon, ArrowRight, Sparkles, Activity } from 'lucide-react';
import type { AgentType } from '@/components/ai/agent-chat';
import { cn } from '@/lib/utils';

const agents: Array<{ type: AgentType; icon: React.ReactNode; label: string; description: string }> = [
    {
        type: 'claims',
        icon: <FileText className="w-6 h-6" />,
        label: 'Claims Agent',
        description: 'Submit and track insurance claims',
    },
    {
        type: 'policy',
        icon: <Shield className="w-6 h-6" />,
        label: 'Policy Agent',
        description: 'Get quotes and manage policies',
    },
    {
        type: 'support',
        icon: <HeadphonesIcon className="w-6 h-6" />,
        label: 'Support Agent',
        description: 'General help and inquiries',
    },
    {
        type: 'compliance',
        icon: <Bot className="w-6 h-6" />,
        label: 'Compliance Agent',
        description: 'Regulatory compliance guidance',
    },
];

interface AIAgentsPanelProps {
    defaultAgent?: AgentType | null;
}

export function AIAgentsPanel({ defaultAgent = null }: AIAgentsPanelProps) {
    const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(defaultAgent);
    const [reasoning, setReasoning] = useState<string>("");
    const [isAgentLoading, setIsAgentLoading] = useState(false);
    const [conversationId, setConversationId] = useState(() => `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    const handleAgentSelect = (type: AgentType) => {
        if (selectedAgent === type) return;
        setSelectedAgent(type);
        setReasoning(""); // Reset reasoning for new agent
        setIsAgentLoading(false);
        // Reset conversation ID for the new agent to start a fresh conversation
        setConversationId(`conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-[2rem] p-4 md:p-8 lg:p-12 shadow-inner border border-white/50 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className={`text-center transition-all duration-700 relative z-10 ${selectedAgent ? 'mb-8 text-left' : 'mb-12'}`}>
                <div className={`flex transition-all duration-700 ${selectedAgent ? 'justify-start mb-4' : 'justify-center mb-6'}`}>
                    <div className={cn("bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-700", selectedAgent ? "p-2" : "p-4")}>
                        <Bot className={cn("text-blue-600 transition-all duration-700", selectedAgent ? "w-6 h-6" : "w-12 h-12")} />
                    </div>
                </div>
                <h2 className={`font-black text-slate-900 transition-all duration-700 tracking-tighter leading-none ${selectedAgent ? 'text-3xl mb-2' : 'text-4xl lg:text-6xl mb-4'}`}>
                    {selectedAgent ? 'Agent Intelligence Mesh' : 'AI-Powered Insurance Assistants'}
                </h2>
                <p className={cn(
                    "text-slate-500 font-medium transition-all duration-700 max-w-2xl",
                    selectedAgent ? "text-base" : "text-lg lg:text-xl mx-auto"
                )}>
                    {selectedAgent
                        ? `Specialized ${selectedAgent} capabilities active. Switch experts anytime.`
                        : 'Choose an AI agent to help you with your insurance needs'}
                </p>
            </div>

            <div className={`flex flex-col lg:flex-row gap-6 relative z-10 overflow-hidden`}>
                <AnimatePresence mode="wait">
                    {selectedAgent && (
                        <motion.div
                            key={`chat-window-${selectedAgent}`}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full lg:w-[55%] h-[600px] shadow-2xl rounded-3xl overflow-hidden border border-white/40"
                        >
                            <AgentChat
                                agentType={selectedAgent}
                                conversationId={conversationId}
                                onClose={() => setSelectedAgent(null)}
                                onReasoning={(r) => setReasoning(r)}
                                onLoading={(l) => {
                                    setIsAgentLoading(l);
                                    if (l) setReasoning(""); // Clear reasoning when loading starts
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    layout
                    className={cn(
                        "gap-4 transition-all duration-700 h-full",
                        selectedAgent
                            ? "w-full lg:w-[45%] flex flex-col overflow-y-auto max-h-[600px] pr-2 custom-scrollbar"
                            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full"
                    )}
                >
                    {agents.map((agent) => {
                        const isSelected = selectedAgent === agent.type;
                        if (isSelected) return null;

                        return (
                            <motion.button
                                layout
                                key={agent.type}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                                onClick={() => handleAgentSelect(agent.type)}
                                className={cn(
                                    "bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/60 transition-all duration-300 transform text-left group flex relative overflow-hidden",
                                    selectedAgent ? 'p-4 mb-2' : 'p-8 lg:p-10 h-full min-h-[280px] flex-col'
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center bg-blue-100 group-hover:bg-blue-600 rounded-2xl transition-all duration-500 shrink-0 shadow-sm",
                                    selectedAgent ? 'w-10 h-10 mr-4' : 'w-16 h-16 mb-6'
                                )}>
                                    <div className="text-blue-600 group-hover:text-white transition-colors">
                                        {React.cloneElement(agent.icon as React.ReactElement<any>, {
                                            size: selectedAgent ? 20 : 32,
                                            className: undefined
                                        })}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className={cn(
                                        "font-black text-slate-900 tracking-tight transition-all duration-500",
                                        selectedAgent ? 'text-base mb-0.5' : 'text-2xl mb-3'
                                    )}>{agent.label}</h3>
                                    <p className={cn(
                                        "text-slate-500 font-medium transition-all duration-500",
                                        selectedAgent ? 'text-[10px] line-clamp-1' : 'text-sm lg:text-base'
                                    )}>{agent.description}</p>
                                </div>
                                {!selectedAgent && (
                                    <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold uppercase text-[10px] tracking-widest group-hover:translate-x-2 transition-all duration-300">
                                        <span>Consult Agent</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                )}
                                {selectedAgent && (
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-4 h-4 text-blue-600" />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}

                    {/* Reasoning Panel */}
                    {selectedAgent && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 flex-1 bg-white/40 backdrop-blur-md rounded-[2rem] border border-orange-200/50 p-6 flex flex-col shadow-inner overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <h3 className="font-black text-slate-900 tracking-tight text-xs uppercase">AI Reasoning Mesh</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
                                {isAgentLoading ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                                        <div className="relative w-12 h-12 mb-4">
                                            <div className="absolute inset-0 rounded-full border-2 border-orange-200 border-t-orange-600 animate-spin" />
                                            <div className="absolute inset-1 flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-orange-600 animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 animate-pulse">Propagating Logic Nodes...</p>
                                    </div>
                                ) : reasoning ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-3"
                                    >
                                        <p className="text-slate-700 text-[13px] font-medium leading-relaxed whitespace-pre-wrap">
                                            {reasoning}
                                        </p>
                                        <div className="flex items-center gap-2 pt-2 border-t border-orange-100/50">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Logic Verified • Real-time Stream</span>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-8">
                                        <Activity className="w-8 h-8 mb-3 animate-pulse text-slate-400" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Synchronizing Cognitive Core...</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            <AnimatePresence>
                {!selectedAgent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-12 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/60 shadow-sm"
                    >
                        <h3 className="font-black text-xl mb-6 text-slate-900 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-blue-600" />
                            Premium AI Features
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Multi-language", desc: "Arabic and English support" },
                                { title: "RAG-powered", desc: "Answers based on IA regulations" },
                                { title: "Compliance", desc: "Real-time regulatory validation" },
                                { title: "Fraud Detection", desc: "AI-powered risk assessment" },
                                { title: "24/7 Availability", desc: "Instant responses anytime" }
                            ].map((feature, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm tracking-tight">{feature.title}</h4>
                                        <p className="text-slate-500 text-xs font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
