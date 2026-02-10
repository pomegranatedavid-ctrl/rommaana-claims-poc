"use client";

import React, { Suspense } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AIAgentsPanel } from "@/components/ai/ai-agents-panel";
import { BrainCircuit, Sparkles, ShieldCheck, Activity } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import type { AgentType } from "@/components/ai/agent-chat";

function AIAssistantsContent() {
    const { language } = useTranslation();
    const searchParams = useSearchParams();
    const agentParam = searchParams.get('agent') as AgentType | null;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col overflow-hidden">
            <AdminHeader />

            <main className="flex-1 container mx-auto p-8 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <p className="text-[#be123c] font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> {language === 'ar' ? 'قوة الذكاء الاصطناعي' : 'AI-POWERED AUTOMATION'}
                        </p>
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            {language === 'ar' ? 'مساعدي التأمين المدعومين بالذكاء الاصطناعي' : 'AI-Powered Insurance Assistants'}
                        </h1>
                        <p className="text-slate-500 font-medium max-w-2xl mt-4">
                            {language === 'ar'
                                ? 'نشر وإدارة وتحسين القوى العاملة الافتراضية الخاصة بك لأتمتة دورة حياة التأمين بالكامل.'
                                : 'Deploy, manage, and optimize your virtual workforce to automate the entire insurance lifecycle.'
                            }
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <QuickStat
                        icon={Activity}
                        label={language === 'ar' ? 'حالات الاستخدام النشطة' : 'Active Use Cases'}
                        value="12"
                        color="blue"
                    />
                    <QuickStat
                        icon={ShieldCheck}
                        label={language === 'ar' ? 'دقة الامتثال' : 'Compliance Accuracy'}
                        value="99.9%"
                        color="rose"
                    />
                    <QuickStat
                        icon={BrainCircuit}
                        label={language === 'ar' ? 'كفاءة المعالجة' : 'Processing Efficiency'}
                        value="+85%"
                        color="indigo"
                    />
                    <QuickStat
                        icon={Sparkles}
                        label={language === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}
                        value="4.9/5"
                        color="amber"
                    />
                </div>

                <div className="bg-white rounded-[3rem] p-12 lg:p-16 border border-slate-100 shadow-premium overflow-hidden">
                    <AIAgentsPanel defaultAgent={agentParam} />
                </div>
            </main>
        </div>
    );
}

export default function AIAssistantsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8fafc]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#be123c]"></div></div>}>
            <AIAssistantsContent />
        </Suspense>
    );
}

function QuickStat({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        rose: "bg-rose-50 text-[#be123c]",
        indigo: "bg-indigo-50 text-indigo-600",
        amber: "bg-amber-50 text-amber-600",
    } as any;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{label}</p>
            </div>
        </motion.div>
    );
}
