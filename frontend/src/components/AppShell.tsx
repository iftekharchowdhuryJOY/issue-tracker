import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    Settings,
    Menu,
    ChevronLeft,
    LogOut,
    Briefcase,
    User
} from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/Button"
import { useAuth } from "../auth/AuthContext"

interface SidebarItemProps {
    icon: React.ElementType
    label: string
    href: string
    collapsed?: boolean
    isActive?: boolean
}

function SidebarItem({ icon: Icon, label, href, collapsed, isActive }: SidebarItemProps) {
    return (
        <Link
            to={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-0"
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
        </Link>
    )
}

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)
    const { logout, user } = useAuth()
    const location = useLocation()

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/" },
        { icon: Briefcase, label: "Projects", href: "/projects" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ]

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside
                className={cn(
                    "hidden md:flex flex-col border-right bg-card border-r transition-all duration-300",
                    isCollapsed ? "w-16" : "w-64"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center justify-between px-4 border-b">
                        {!isCollapsed && (
                            <span className="font-bold text-lg tracking-tight text-primary">IssueTrack</span>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                        </Button>
                    </div>

                    <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.href}
                                {...item}
                                collapsed={isCollapsed}
                                isActive={location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))}
                            />
                        ))}
                    </nav>

                    <div className="p-2 border-t space-y-1">
                        <div className={cn("flex items-center gap-3 px-3 py-3 mb-2", isCollapsed && "justify-center px-0")}>
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <User className="h-4 w-4" />
                            </div>
                            {!isCollapsed && (
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-semibold truncate leading-none mb-1">{user?.email?.split('@')[0]}</span>
                                    <span className="text-xs text-muted-foreground truncate leading-none">{user?.email}</span>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            className={cn("w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive", isCollapsed && "justify-center")}
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            {!isCollapsed && <span className="ml-3">Logout</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
                {/* Topbar - Mobile Toggle */}
                <header className="h-16 md:hidden flex items-center justify-between px-4 bg-card border-b">
                    <span className="font-bold text-lg tracking-tight text-primary">IssueTrack</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                >
                    <div
                        className="fixed inset-y-0 left-0 w-64 bg-card shadow-xl border-r p-4 space-y-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-lg text-primary">IssueTrack</span>
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <SidebarItem
                                    key={item.href}
                                    {...item}
                                    isActive={location.pathname === item.href}
                                />
                            ))}
                        </nav>
                        <div className="absolute bottom-4 left-4 right-4">
                            <Button variant="outline" className="w-full justify-start text-destructive" onClick={logout}>
                                <LogOut className="h-4 w-4 mr-3" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
