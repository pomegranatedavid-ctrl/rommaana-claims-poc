"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCircle, Globe, ChevronDown, Key, Book, Info, LogOut, Users, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";
import { useRole } from "@/context/role-context";
import { AboutModal } from "./about-modal";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { t, language, setLanguage } = useTranslation();
    const { role, setRole } = useRole();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const aiModules = [
        { name: t("common.claims_workbench"), href: "/admin/dashboard", roles: ["Admin", "Insurer"] },
        { name: t("common.sales_growth"), href: "/admin/growth", roles: ["Admin", "B2B_Partner"] },
        { name: t("common.risk_guardian"), href: "/admin/risk", roles: ["Admin", "Insurer"] },
        { name: t("common.customer_interactions"), href: "/admin/interactions", roles: ["Admin"] },
    ].filter(item => item.roles.includes(role));

    const configuration = [
        { name: t("common.ai_agents"), href: "/admin/agents", roles: ["Admin", "Insurer"] },
        { name: t("common.user_management"), href: "/admin/users", roles: ["Admin"] },
    ].filter(item => item.roles.includes(role));

    const handleLogout = () => {
        // Mock logout
        router.push("/");
    };

    const getRoleDisplayName = (r: string) => {
        switch (r) {
            case "Admin": return t("login.role_admin");
            case "Insurer": return t("login.role_insurer");
            case "B2B_Partner": return t("login.role_partner");
            case "Customer": return t("login.role_customer");
            default: return r;
        }
    };

    const NavDropdown = ({ title, items }: { title: string; items: typeof aiModules }) => {
        const [isOpen, setIsOpen] = useState(false);
        const timeoutRef = useRef<NodeJS.Timeout | null>(null);

        const handleMouseEnter = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsOpen(true);
        };

        const handleMouseLeave = () => {
            timeoutRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 100);
        };

        return (
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Button
                    variant="ghost"
                    className={cn(
                        "text-slate-600 font-bold hover:text-[#be123c] hover:bg-rose-50/50 h-10 px-4 rounded-xl flex items-center gap-2 transition-all",
                        isOpen && "text-[#be123c] bg-rose-50/50"
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {title}
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
                </Button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                            className={cn(
                                "absolute top-full mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-premium border border-slate-200/50 py-3 z-50 overflow-hidden",
                                language === 'ar' ? "right-0" : "left-0"
                            )}
                        >
                            <div className="px-6 py-2 mb-2 border-b border-slate-100/50">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                            </div>
                            <div className="px-2 space-y-1">
                                {items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                            <div className={cn(
                                                "px-4 py-3.5 rounded-xl flex items-center justify-between group cursor-pointer transition-all duration-300",
                                                isActive ? "bg-rose-50 text-[#be123c] font-black" : "hover:bg-slate-50 text-slate-600 font-bold hover:text-slate-900"
                                            )}>
                                                <span className="text-sm tracking-tight">{item.name}</span>
                                                <ChevronRight className={cn(
                                                    "w-4 h-4 opacity-0 transition-all duration-300",
                                                    isActive ? "opacity-100 text-[#be123c]" : "group-hover:opacity-100 group-hover:translate-x-1",
                                                    language === 'ar' && "rotate-180"
                                                )} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <header className="glass-header h-20 flex items-center px-8 shadow-sm justify-between sticky top-0 z-50">
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

            <div className="flex items-center gap-12">
                {/* Logo */}
                <Link href="/admin" className="transition-opacity hover:opacity-80">
                    <img
                        src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png"
                        alt="Rommaana Logo"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center gap-2">
                    <NavDropdown title={t("common.ai_modules")} items={aiModules} />
                    <NavDropdown title={t("common.configuration")} items={configuration} />

                    <Link href="/admin/how-it-works">
                        <Button
                            variant="ghost"
                            className={cn(
                                "text-slate-600 font-bold hover:text-[#be123c] hover:bg-rose-50/30 h-10 px-4 rounded-xl transition-all text-sm tracking-tight",
                                pathname === "/admin/how-it-works" && "text-[#be123c] bg-rose-50/50"
                            )}
                        >
                            {t("common.how_it_works")}
                        </Button>
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-[#be123c] transition-colors"
                    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">{language === 'en' ? 'العربية' : 'English'}</span>
                </Button>

                <div className="relative">
                    <div
                        className="flex items-center gap-4 cursor-pointer hover:bg-slate-100/50 p-1.5 rounded-2xl transition-all border border-transparent hover:border-slate-200"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-slate-900 leading-none tracking-tight">
                                {getRoleDisplayName(role)}
                            </p>
                            <p className="text-[9px] text-slate-400 font-black mt-1 uppercase tracking-[0.1em]">
                                {role === "Admin" ? "Rommaana Enterprise" : role}
                            </p>
                        </div>
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm overflow-hidden">
                                {role === "Admin" ? <Users className="w-5 h-5" /> : <UserCircle className="w-9 h-9 text-slate-400" />}
                            </div>
                            <div className={cn("absolute -bottom-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100", language === 'ar' ? "-left-1" : "-right-1")}>
                                <ChevronDown className={cn("w-2.5 h-2.5 text-slate-900 transition-transform duration-300", isProfileOpen && "rotate-180")} />
                            </div>
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                            <div className={cn(
                                "absolute mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 flex flex-col items-stretch animate-in fade-in zoom-in duration-200 origin-top-right",
                                language === 'ar' ? "left-0 origin-top-left" : "right-0"
                            )}>
                                <Button
                                    variant="ghost"
                                    className="justify-start gap-3 px-6 h-11 text-slate-600 font-bold hover:text-[#be123c] hover:bg-rose-50/50 rounded-none"
                                >
                                    <Key className="w-4 h-4" /> {t("profile.change_password")}
                                </Button>
                                <Link href="/admin/manual">
                                    <Button
                                        variant="ghost"
                                        className="justify-start gap-3 px-6 h-11 text-slate-600 font-bold hover:text-[#be123c] hover:bg-rose-50/50 rounded-none w-full"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <Book className="w-4 h-4" /> {t("profile.user_manual")}
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="justify-start gap-3 px-6 h-11 text-slate-600 font-bold hover:text-[#be123c] hover:bg-rose-50/50 rounded-none"
                                    onClick={() => {
                                        setIsAboutOpen(true);
                                        setIsProfileOpen(false);
                                    }}
                                >
                                    <Info className="w-4 h-4" /> {t("profile.about")}
                                </Button>
                                <div className="h-px bg-slate-100 my-2" />
                                <Button
                                    variant="ghost"
                                    className="justify-start gap-3 px-6 h-11 text-rose-600 font-bold hover:bg-rose-50 rounded-none"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4" /> {t("profile.logout")}
                                </Button>

                                <div className="h-px bg-slate-100 my-2" />
                                <div className="px-6 py-2">
                                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{t("common.switch_role")}</p>
                                    <div className="space-y-1">
                                        {(["Admin", "Insurer", "B2B_Partner", "Customer"] as const).map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRole(r)}
                                                className={cn(
                                                    "block w-full text-left text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors",
                                                    role === r ? "font-bold text-[#be123c] bg-rose-50" : "text-slate-600"
                                                )}
                                            >
                                                {getRoleDisplayName(r)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
