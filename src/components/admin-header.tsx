"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCircle, Globe, ChevronDown, Key, Book, Info, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/language-context";
import { AboutModal } from "./about-modal";
import { useState } from "react";

export function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { t, language, setLanguage } = useTranslation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const navItems = [
        { name: t("common.claims_workbench"), href: "/admin/dashboard" },
        { name: t("common.sales_growth"), href: "/admin/growth" },
        { name: t("common.risk_guardian"), href: "/admin/risk" },
        { name: t("common.how_it_works"), href: "/admin/how-it-works" },
    ];

    const handleLogout = () => {
        // Mock logout
        router.push("/");
    };

    return (
        <header className="bg-white border-b h-20 flex items-center px-6 shadow-sm justify-between sticky top-0 z-50">
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

            <div className="flex items-center gap-8">
                {/* Logo */}
                <Link href="/admin">
                    <img
                        src="https://static.wixstatic.com/media/2dc74f_9ffb3f627ced42538647f70532f450f5~mv2.png/v1/fill/w_590,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RommaanaAsset%201.png"
                        alt="Rommaana Logo"
                        className="h-12 w-auto object-contain"
                    />
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "text-slate-600 font-medium hover:text-[#be123c] hover:bg-red-50",
                                        isActive && "text-[#be123c] bg-red-50"
                                    )}
                                >
                                    {item.name}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-slate-600 font-bold"
                    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                >
                    <Globe className="w-4 h-4" />
                    <span>{language === 'en' ? 'العربية' : 'English'}</span>
                </Button>

                <div className="relative">
                    <div
                        className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none">Admin User</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Rommaana Enterprise</p>
                        </div>
                        <div className="relative">
                            <UserCircle className="w-8 h-8 text-slate-400" />
                            <ChevronDown className={cn("w-3 h-3 text-slate-400 absolute -bottom-1 -right-1 bg-white rounded-full transition-transform", isProfileOpen && "rotate-180")} />
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 flex flex-col items-stretch animate-in fade-in zoom-in duration-200 origin-top-right">
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
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
