"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  FileText,
  Globe,
  ArrowRight,
  BrainCircuit,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  Activity,
  Lock,
  Cpu,
  Network,
  Scale
} from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

export default function Home() {
  const { t, language, setLanguage } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-rose-50/50 rounded-full blur-[120px] opacity-40"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px] opacity-30"
        />
        <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] opacity-20"
        />
      </div>

      {/* Premium Navigation */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 lg:px-12",
        scrolled ? "py-4" : "py-8"
      )}>
        <div className={cn(
          "container mx-auto px-6 h-16 flex items-center justify-between transition-all duration-500 rounded-[2rem] border",
          scrolled
            ? "bg-white/80 backdrop-blur-2xl border-slate-200/50 shadow-premium"
            : "bg-transparent border-transparent"
        )}>
          <div className="flex items-center gap-12">
            <Link href="/" className="transition-transform active:scale-95">
              <img
                src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png"
                alt="Rommaana Logo"
                className="h-9 w-auto object-contain"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <NavLink href="#modules">{t("common.products")}</NavLink>
              <NavLink href="#trust">{t("common.solutions")}</NavLink>
              <NavLink href="#innovations">{t("common.innovation")}</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 hover:text-[#be123c] rounded-xl px-4 transition-all"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </Button>

            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-slate-900 font-bold hover:bg-slate-100 rounded-xl px-6">
                {t("common.login")}
              </Button>
            </Link>

            <Link href="/login">
              <Button className="bg-slate-900 hover:bg-black text-white font-black rounded-xl px-8 shadow-lg shadow-slate-200 group active:scale-95 transition-all">
                {t("common.get_started")}
                <ArrowRight className={cn("w-4 h-4 relative group-hover:translate-x-1 transition-transform", language === 'ar' ? "mr-2 rotate-180" : "ml-2")} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 lg:pt-48">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-12 pb-24 lg:pb-32">
          <div className="container mx-auto px-4 text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full text-[#be123c] text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm border border-rose-100/50">
                <Sparkles className="w-3 h-3 fill-current" /> {t("hero.tagline")}
              </div>

              <h1 className="text-5xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[1] lg:leading-[0.9]">
                {t("hero.title_part1")} <br className="hidden lg:block" />
                <span className="bg-gradient-to-r from-[#be123c] to-indigo-600 bg-clip-text text-transparent">
                  {t("hero.title_part2")}
                </span>
              </h1>

              <p className="text-lg lg:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login">
                  <Button size="lg" className="h-16 rounded-2xl px-12 text-lg font-black bg-slate-900 hover:bg-black shadow-2xl shadow-slate-200 group transition-all">
                    {t("hero.enter_ecosystem")}
                    <ArrowRight className={cn("w-5 h-5 group-hover:translate-x-1 transition-transform", language === 'ar' ? "mr-2 rotate-180" : "ml-2")} />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-16 rounded-2xl px-12 text-lg font-bold border-slate-200 hover:bg-slate-50 text-slate-900 transition-all">
                  {t("hero.view_whitepaper")}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 mt-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png" alt="SAMA" className="h-8" />
                <div className="h-4 w-px bg-slate-300 mx-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("hero.trusted_regulated")}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The 6-Pillar Ecosystem Section */}
        <section id="modules" className="py-24 relative px-6 lg:px-12 bg-white/40 backdrop-blur-sm border-t border-slate-100 scroll-mt-32">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8 lg:px-4">
              <div className="max-w-2xl">
                <p className="text-[#be123c] font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> {t("modules.section_tag")}
                </p>
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                  {t("modules.title")}
                </h2>
              </div>
              <p className="text-slate-500 font-medium max-w-sm lg:text-right">
                {t("modules.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4">
              <ModulePreview
                icon={BrainCircuit}
                title={t("modules.claims_title")}
                desc={t("modules.claims_desc")}
                color="blue"
                label={t("modules.claims_label")}
                linkText={t("modules.explore")}
                slug="claims-workbench"
                isRTL={language === 'ar'}
              />
              <ModulePreview
                icon={ShieldAlert}
                title={t("modules.risk_title")}
                desc={t("modules.risk_desc")}
                color="amber"
                label={t("modules.risk_label")}
                linkText={t("modules.explore")}
                slug="risk-guardian"
                isRTL={language === 'ar'}
              />
              <ModulePreview
                icon={TrendingUp}
                title={t("modules.sales_title")}
                desc={t("modules.sales_desc")}
                color="emerald"
                label={t("modules.sales_label")}
                linkText={t("modules.explore")}
                slug="sales-velocity"
                isRTL={language === 'ar'}
              />
              <ModulePreview
                icon={Network}
                title={t("modules.agents_title")}
                desc={t("modules.agents_desc")}
                color="indigo"
                label={t("modules.agents_label")}
                linkText={t("modules.explore")}
                slug="agent-orchestra"
                isRTL={language === 'ar'}
              />
              <ModulePreview
                icon={Sparkles}
                title={t("modules.persona_title")}
                desc={t("modules.persona_desc")}
                color="rose"
                label={t("modules.persona_label")}
                linkText={t("modules.explore")}
                slug="persona-lab"
                isRTL={language === 'ar'}
              />
              <ModulePreview
                icon={Lock}
                title={t("modules.nexus_title")}
                desc={t("modules.nexus_desc")}
                color="slate"
                label={t("modules.nexus_label")}
                linkText={t("modules.explore")}
                slug="enterprise-nexus"
                isRTL={language === 'ar'}
              />
            </div>
          </div>
        </section>

        {/* Stats Section / Trust Wall */}
        <section id="trust" className="py-24 border-y border-slate-100 relative scroll-mt-32">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
              <StatItem value="98%" label={t("stats.intent_accuracy")} />
              <StatItem value="<2m" label={t("stats.claim_intake")} />
              <StatItem value="SAR 1B+" label={t("stats.risk_capacity")} />
              <StatItem value="24/7" label={t("stats.agent_uptime")} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="innovations" className="py-32 bg-slate-900 relative overflow-hidden scroll-mt-32">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter">
              {t("cta.ready_title")}
            </h2>
            <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto font-medium">
              {t("cta.ready_desc")}
            </p>
            <Link href="/login">
              <Button size="lg" className="h-16 rounded-2xl px-12 text-lg font-black bg-white text-slate-900 hover:bg-rose-50 hover:text-[#be123c] transition-all">
                {t("cta.request_access")} <ArrowRight className={cn("w-5 h-5", language === 'ar' ? "mr-2 rotate-180" : "ml-2")} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] py-2 relative group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#be123c] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </a>
  );
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 hover:border-blue-200",
  amber: "bg-amber-50 text-amber-600 hover:border-amber-200",
  emerald: "bg-emerald-50 text-emerald-600 hover:border-emerald-200",
  indigo: "bg-indigo-50 text-indigo-600 hover:border-indigo-200",
  rose: "bg-rose-50 text-[#be123c] hover:border-rose-200",
  slate: "bg-slate-100 text-slate-600 hover:border-slate-300",
};

type ModuleColor = keyof typeof colorClasses;

function ModulePreview({ icon: Icon, title, desc, color, label, linkText, isRTL, slug }: { icon: any, title: string, desc: string, color: string, label: string, linkText: string, isRTL: boolean, slug: string }) {
  const themeColor = color as ModuleColor;

  const bgClass = colorClasses[themeColor] || colorClasses.slate;

  const iconColorClass = {
    blue: "text-blue-600",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    indigo: "text-indigo-600",
    rose: "text-[#be123c]",
    slate: "text-slate-900",
  }[themeColor] || "text-slate-900";

  return (
    <Link href={`/solutions/${slug}`}>
      <motion.div
        whileHover={{ y: -10 }}
        className={cn(
          "p-8 lg:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 group cursor-pointer h-full"
        )}
      >
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 shadow-sm", bgClass)}>
          <Icon className="w-7 h-7" />
        </div>
        <p className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-3", iconColorClass)}>
          {label}
        </p>
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">{desc}</p>
        <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          {linkText} <ArrowRight className={cn("w-3 h-3", isRTL ? "rotate-180" : "")} />
        </div>
      </motion.div>
    </Link>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="space-y-2">
      <p className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#be123c]">{label}</p>
    </div>
  );
}
