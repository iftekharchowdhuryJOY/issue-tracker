import {
    TrendingUp,
    Users,
    CheckCircle2,
    Timer,
    Activity,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

interface StatCardProps {
    title: string;
    value: string;
    subValue: string;
    trend: 'up' | 'down';
    icon: React.ElementType;
}

function StatCard({ title, value, subValue, trend, icon: Icon }: StatCardProps) {
    return (
        <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center gap-1 mt-1">
                    {trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    ) : (
                        <ArrowDownRight className="h-3 w-3 text-rose-500" />
                    )}
                    <span className={cn("text-xs font-medium", trend === 'up' ? "text-emerald-600" : "text-rose-600")}>
                        {subValue}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-1">vs last week</span>
                </div>
            </CardContent>
        </Card>
    )
}

import { cn } from "../lib/utils";

export default function Dashboard() {
    return (
        <AppShell>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening with your projects.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Projects"
                        value="12"
                        subValue="+2"
                        trend="up"
                        icon={TrendingUp}
                    />
                    <StatCard
                        title="Active Issues"
                        value="84"
                        subValue="+12%"
                        trend="up"
                        icon={Activity}
                    />
                    <StatCard
                        title="Avg Resolve Time"
                        value="1.4d"
                        subValue="-4h"
                        trend="down"
                        icon={Timer}
                    />
                    <StatCard
                        title="Contributors"
                        value="24"
                        subValue="+3"
                        trend="up"
                        icon={Users}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-slate-200/60">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Recent Velocity</CardTitle>
                            <Button variant="outline" size="sm">Download CSV</Button>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center text-slate-400 bg-slate-50/50 rounded-md border-2 border-dashed mx-6 mb-6">
                            Chart visualization would go here
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/60">
                        <CardHeader>
                            <CardTitle className="text-lg">Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Issue #129 resolved</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Alex completed the Customer Portal login task.</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs text-muted-foreground">See all activity</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
