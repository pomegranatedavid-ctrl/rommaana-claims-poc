"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
} | null>(null);

const Select = ({ value, onValueChange, children }: SelectProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
            <div className="relative w-full">{children}</div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    const context = React.useContext(SelectContext);
    if (!context) return null;

    return (
        <button
            type="button"
            onClick={() => context.setIsOpen(!context.isOpen)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
};

const SelectValue = () => {
    const context = React.useContext(SelectContext);
    if (!context) return null;
    return <span className="text-slate-700">{context.value || "Select..."}</span>;
};

const SelectContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const context = React.useContext(SelectContext);
    if (!context || !context.isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={() => context.setIsOpen(false)} />
            <div
                className={cn(
                    "absolute top-full z-[100] mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 text-slate-900 shadow-xl animate-in fade-in zoom-in-95",
                    className
                )}
            >
                {children}
            </div>
        </>
    );
};

const SelectItem = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
    const context = React.useContext(SelectContext);
    if (!context) return null;

    const isSelected = context.value === value;

    return (
        <div
            onClick={() => {
                context.onValueChange?.(value);
                context.setIsOpen(false);
            }}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-3 text-sm outline-none hover:bg-slate-100 hover:text-[#be123c] transition-colors",
                isSelected && "bg-rose-50 text-[#be123c] font-bold",
                className
            )}
        >
            {children}
        </div>
    );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
