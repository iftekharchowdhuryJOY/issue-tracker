import * as React from "react"
import { cn } from "../../lib/utils"

export interface TabsProps {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
    className?: string
}

export function Tabs({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={cn("space-y-4", className)}>{children}</div>
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
            {children}
        </div>
    )
}

export function TabsTrigger({
    value,
    activeValue,
    onClick,
    children,
    className
}: {
    value: string;
    activeValue: string;
    onClick: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}) {
    const isActive = value === activeValue
    return (
        <button
            type="button"
            onClick={() => onClick(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-background text-foreground shadow-sm" : "hover:text-foreground",
                className
            )}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, activeValue, children }: { value: string; activeValue: string; children: React.ReactNode }) {
    if (value !== activeValue) return null
    return <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{children}</div>
}
