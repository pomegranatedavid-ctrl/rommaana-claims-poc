"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
    activeTab: string;
    setActiveTab: (value: string) => void;
} | null>(null);

const Tabs = ({ defaultValue, className, onValueChange, children }: { defaultValue: string, className?: string, onValueChange?: (value: string) => void, children: React.ReactNode }) => {
    const [activeTab, setActiveTabState] = React.useState(defaultValue);

    const setActiveTab = (value: string) => {
        setActiveTabState(value);
        if (onValueChange) onValueChange(value);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn("flex flex-col", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

const TabsList = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
        {children}
    </div>
);

const TabsTrigger = ({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) => {
    const context = React.useContext(TabsContext);
    if (!context) return null;

    const isActive = context.activeTab === value;
    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50",
                className
            )}
            data-state={isActive ? "active" : "inactive"}
        >
            {children}
        </button>
    );
};

const TabsContent = ({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) => {
    const context = React.useContext(TabsContext);
    if (!context || context.activeTab !== value) return null;

    return (
        <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
