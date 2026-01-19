"use client";

import { useTranslation } from "@/context/language-context";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

export default function SolutionPage() {
    const { slug } = useParams();
    const { t, language } = useTranslation();
    const isRTL = language === 'ar';

    // Fallback if slug doesn't match known keys
    const solutionKey = `solution_details.${slug as string}`;
    const title = t(`${solutionKey}.title`);
    const tagline = t(`${solutionKey}.tagline`);
    const description = t(`${solutionKey}.description`);
    const benefit1 = t(`${solutionKey}.benefit1`);
    const benefit2 = t(`${solutionKey}.benefit2`);
    const benefit3 = t(`${solutionKey}.benefit3`);

    // If translation is missing (returns key), show 404-like state or generic
    if (title.startsWith("solution_details.")) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">Solution Not Found</h1>
                    <Link href="/">
                        <Button>Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 py-6 px-6 lg:px-12 pointer-events-none">
                <div className="container mx-auto flex justify-between items-center pointer-events-auto">
                    <Link href="/">
                        <img
                            src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png"
                            alt="Rommaana"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>
                    <Link href="/login">
                        <Button className="bg-slate-900 text-white rounded-xl shadow-lg hover:bg-black transition-all">
                            {t("common.get_started")}
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-24 px-6 lg:px-12">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full text-[#be123c] text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm border border-rose-100/50">
                            <Sparkles className="w-3 h-3 fill-current" /> {t("common.solutions")}
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
                            {title}
                        </h1>
                        <p className="text-2xl font-bold bg-gradient-to-r from-[#be123c] to-indigo-600 bg-clip-text text-transparent mb-8">
                            {tagline}
                        </p>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                            {description}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {[benefit1, benefit2, benefit3].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-[#be123c]">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">{benefit}</h3>
                                <p className="text-sm text-slate-500 font-medium">
                                    {t("common.benefit_desc_placeholder") || "Comprehensive enterprise deployment with full SAMA compliance."}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[60%] h-full bg-indigo-600/20 blur-[100px] rounded-full point-events-none" />
                        <div className="relative z-10">
                            <ShieldCheck className="w-16 h-16 text-white mx-auto mb-8 opacity-50" />
                            <h2 className="text-3xl lg:text-5xl font-black text-white mb-8 tracking-tight">
                                {t("cta.ready_title")}
                            </h2>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="/login">
                                    <Button size="lg" className="h-14 rounded-xl px-10 bg-white text-slate-900 hover:bg-rose-50 hover:text-[#be123c] font-black text-lg">
                                        {t("cta.request_access")}
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="outline" size="lg" className="h-14 rounded-xl px-10 border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white font-bold">
                                        {t("common.back_home")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
