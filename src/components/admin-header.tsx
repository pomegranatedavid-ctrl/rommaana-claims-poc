"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminHeader() {
    const pathname = usePathname();

    const navItems = [
        { name: "Claims Workbench", href: "/admin/dashboard" },
        { name: "Sales Growth", href: "/admin/growth" },
        { name: "Risk Guardian", href: "/admin/risk" },
        { name: "How it works", href: "/admin/how-it-works" },
    ];

    return (
        <header className="bg-white border-b h-20 flex items-center px-6 shadow-sm justify-between sticky top-0 z-50">
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
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900">Admin User</p>
                    <p className="text-xs text-slate-500">Rommaana Enterprise</p>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full">
                    <UserCircle className="w-8 h-8 text-slate-400" />
                </Button>
            </div>
        </header>
    );
}
