"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { useTranslation } from "@/context/language-context";
import { ShieldCheck, Zap, TrendingUp, BrainCircuit } from "lucide-react";

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-[#be123c] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <img
                            src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png"
                            alt="Rommaana Logo"
                            className="h-16 w-auto brightness-0 invert mb-4"
                        />
                        <h2 className="text-3xl font-bold tracking-tight">{t("about_modal.title")}</h2>
                        <p className="text-rose-100 font-medium">{t("about_modal.subtitle")}</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    <p className="text-slate-600 leading-relaxed text-center font-medium">
                        {t("about_modal.mission")}
                    </p>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <ShieldCheck className="w-6 h-6 text-[#be123c]" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">{t("about_modal.benefit1_title")}</h4>
                            <p className="text-[11px] text-slate-500 leading-tight">{t("about_modal.benefit1_desc")}</p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-6 h-6 text-amber-600" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">{t("about_modal.benefit2_title")}</h4>
                            <p className="text-[11px] text-slate-500 leading-tight">{t("about_modal.benefit2_desc")}</p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm">{t("about_modal.benefit3_title")}</h4>
                            <p className="text-[11px] text-slate-500 leading-tight">{t("about_modal.benefit3_desc")}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 flex items-center gap-4 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                            <BrainCircuit className="w-5 h-5 text-[#be123c]" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                            {t("about_modal.performance_boost")}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
