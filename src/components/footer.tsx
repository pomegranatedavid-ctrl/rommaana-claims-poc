"use client";

import Link from "next/link";
import { useTranslation } from "@/context/language-context";
import { ShieldCheck, Lock, Activity } from "lucide-react";

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-slate-950 text-slate-400 py-16 px-6 lg:px-12 border-t border-slate-900">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
                    <div className="col-span-2">
                        <img
                            src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png"
                            alt="Rommaana"
                            className="h-8 w-auto brightness-0 invert opacity-40 mb-8"
                        />
                        <p className="max-w-xs text-sm leading-relaxed font-medium">
                            {t("footer.empowering")}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">{t("footer.solution_suite")}</h4>
                        <ul className="space-y-4 text-xs font-bold">
                            <li><Link href="/solutions/claims-workbench" className="hover:text-[#be123c] transition-colors">{t("modules.claims_title")}</Link></li>
                            <li><Link href="/solutions/risk-guardian" className="hover:text-[#be123c] transition-colors">{t("modules.risk_title")}</Link></li>
                            <li><Link href="/solutions/sales-velocity" className="hover:text-[#be123c] transition-colors">{t("modules.sales_title")}</Link></li>
                            <li><Link href="/solutions/agent-orchestra" className="hover:text-[#be123c] transition-colors">{t("modules.agents_title")}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">{t("footer.ecosystem")}</h4>
                        <ul className="space-y-4 text-xs font-bold">
                            <li><Link href="/solutions/enterprise-nexus" className="hover:text-[#be123c] transition-colors">{t("footer.sovereign_llms")}</Link></li>
                            <li><Link href="/solutions/sales-velocity" className="hover:text-[#be123c] transition-colors">{t("footer.b2b_integration")}</Link></li>
                            <li><Link href="/solutions/risk-guardian" className="hover:text-[#be123c] transition-colors">{t("footer.compliance")}</Link></li>
                            <li><Link href="/#innovations" className="hover:text-[#be123c] transition-colors">{t("footer.security_whitepaper")}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        &copy; 2026 {t("common.copyright")}
                    </p>
                    <div className="flex items-center gap-6 opacity-20">
                        <ShieldCheck className="w-5 h-5 text-white" />
                        <Lock className="w-5 h-5 text-white" />
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
