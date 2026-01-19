"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ShieldCheck,
    UserCircle,
    Building2,
    ArrowRight,
    Lock,
    Mail,
    Fingerprint,
    CheckCircle2,
    Briefcase,
    Sparkles,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/context/language-context";
import { useRole, Role as AppRole } from "@/context/role-context";

type Role = "admin" | "insurer" | "partner" | "customer";

interface Persona {
    id: Role;
    appRole: AppRole;
    icon: React.ElementType;
    titleKey: string;
    descKey: string;
    color: string;
}

export default function LoginPage() {
    const { t, language } = useTranslation();
    const { setRole } = useRole();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role>("admin");
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const demoCredentials = {
        admin: { user: "admin@rommaana.ai", pass: "admin123" },
        insurer: { user: "underwriter@rommaana.ai", pass: "risk123" },
        partner: { user: "partner@brokerage.com", pass: "partner123" },
        customer: { user: "1002938475", pass: "user123" }
    };

    const handleAutoFill = () => {
        const creds = demoCredentials[selectedRole];
        setUsername(creds.user);
        setPassword(creds.pass);
    };

    const personas: Persona[] = [
        {
            id: "admin",
            appRole: "Admin",
            icon: ShieldCheck,
            titleKey: "login.role_admin",
            descKey: "login.desc_admin",
            color: "rose"
        },
        {
            id: "insurer",
            appRole: "Insurer",
            icon: Briefcase,
            titleKey: "login.role_insurer",
            descKey: "login.desc_insurer",
            color: "blue"
        },
        {
            id: "partner",
            appRole: "B2B_Partner",
            icon: Building2,
            titleKey: "login.role_partner",
            descKey: "login.desc_partner",
            color: "indigo"
        },
        {
            id: "customer",
            appRole: "Customer",
            icon: UserCircle,
            titleKey: "login.role_customer",
            descKey: "login.desc_customer",
            color: "amber"
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const persona = personas.find(p => p.id === selectedRole);
        if (persona) {
            setRole(persona.appRole);
        }

        // Simulate login delay
        setTimeout(() => {
            if (selectedRole === "admin" || selectedRole === "insurer") {
                router.push("/admin");
            } else if (selectedRole === "partner") {
                router.push("/admin/users");
            } else {
                router.push("/claims/new");
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
            >
                {/* Left Panel: Branding & Role Selection */}
                <div className="p-8 lg:p-12 bg-slate-50 border-r border-slate-100 flex flex-col">
                    <div className="mb-12">
                        <Link href="/">
                            <img
                                src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png"
                                alt="Rommaana Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-8">{t("login.select_persona")}</h2>
                        <p className="text-slate-500 font-medium mt-2">{t("login.subtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        {personas.map((persona) => {
                            const Icon = persona.icon;
                            const isActive = selectedRole === persona.id;

                            return (
                                <motion.div
                                    key={persona.id}
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSelectedRole(persona.id);
                                        setUsername("");
                                        setPassword("");
                                    }}
                                    className={cn(
                                        "p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden group",
                                        isActive
                                            ? "bg-white border-[#be123c] shadow-lg shadow-rose-100"
                                            : "bg-white border-transparent hover:border-slate-200"
                                    )}
                                >
                                    {isActive && (
                                        <div className={cn("absolute top-3", language === 'ar' ? "left-3" : "right-3")}>
                                            <CheckCircle2 className="w-5 h-5 text-[#be123c]" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                                        isActive ? "bg-[#be123c] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            "font-black text-sm uppercase tracking-wider",
                                            isActive ? "text-slate-900" : "text-slate-400"
                                        )}>{t(persona.titleKey)}</h3>
                                        <p className="text-xs font-medium text-slate-500 mt-1 leading-snug">{t(persona.descKey)}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Fingerprint className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {t("login.title")}
                        </p>
                    </div>
                </div>

                {/* Right Panel: Login Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                    <Card className="border-none shadow-none bg-transparent w-full max-w-sm mx-auto">
                        <CardHeader className="p-0 mb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">{t("common.login")}</CardTitle>
                                    <CardDescription className="text-base font-medium mt-2">
                                        Accessing as <span className="text-[#be123c] font-black capitalize">{t(`login.role_${selectedRole}`)}</span>
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleAutoFill}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-dashed border-[#be123c] text-[#be123c] font-black uppercase text-[10px] gap-2 hover:bg-rose-50"
                                >
                                    <Zap className="w-3 h-3 fill-current" /> {t("login.quick_demo")}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 block px-1">
                                        {t("login.email_placeholder")}
                                    </label>
                                    <div className="relative">
                                        <div className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", language === 'ar' ? "right-4" : "left-4")}>
                                            {selectedRole === "customer" ? <UserCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                                        </div>
                                        <Input
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={cn(
                                                "h-14 bg-slate-50 border-transparent rounded-2xl font-medium focus:bg-white focus:ring-2 focus:ring-[#be123c]/20 transition-all border-2 focus:border-[#be123c]",
                                                language === 'ar' ? "pr-12 text-right" : "pl-12"
                                            )}
                                            placeholder={selectedRole === "customer" ? "10xxxxxxxx" : "name@company.com"}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 block px-1">
                                        {t("login.password_placeholder")}
                                    </label>
                                    <div className="relative">
                                        <div className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", language === 'ar' ? "right-4" : "left-4")}>
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={cn(
                                                "h-14 bg-slate-50 border-transparent rounded-2xl font-medium focus:bg-white focus:ring-2 focus:ring-[#be123c]/20 transition-all border-2 focus:border-[#be123c]",
                                                language === 'ar' ? "pr-12 text-right" : "pl-12"
                                            )}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98] group"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <span>{t("login.authenticating")}</span>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {t("login.enter_portal")} <ArrowRight className={cn("w-5 h-5 active:scale-95 transition-transform", language === 'ar' ? "mr-2 rotate-180" : "ml-2")} />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="p-0 mt-10">
                            <div className="w-full text-center space-y-4">
                                <p className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-400" /> Authorized use only. Encryption: <span className="text-slate-900 font-bold">AES-256 GCM</span>
                                </p>
                                <div className="flex items-center justify-center gap-6 pb-2">
                                    <img src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png" alt="SAMA" className="h-6 opacity-20 grayscale" />
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
