import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    TrendingUp,
    Users,
    CheckCircle2,
    Timer,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Plus
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";
import { fetchProjects } from "../api/projects";
import { fetchAllIssues } from "../api/issues";
import type { Issue } from "../types/issue";

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

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeIssues: 0,
        doneIssues: 0,
    });
    const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        setIsLoading(true);
        try {
            const [projectsData, issuesData] = await Promise.all([
                fetchProjects(1, 1), // Just to get total
                fetchAllIssues(1, 5) // Recent 5 issues
            ]);

            // In a real app we'd have a stats endpoint. 
            // Here we'll just use the totals from the responses.
            setStats({
                totalProjects: projectsData.total,
                activeIssues: issuesData.items.filter(i => i.status !== 'done').length, // This is just for the page, not real global count
                doneIssues: issuesData.items.filter(i => i.status === 'done').length,
            });
            setRecentIssues(issuesData.items);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Loading dashboard...</p>
                </div>
            </AppShell>
        );
    }

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
                        value={stats.totalProjects.toString()}
                        subValue="+1"
                        trend="up"
                        icon={TrendingUp}
                    />
                    <StatCard
                        title="Recent Issues"
                        value={recentIssues.length.toString()}
                        subValue="New"
                        trend="up"
                        icon={Activity}
                    />
                    <StatCard
                        title="Done Issues"
                        value={recentIssues.filter(i => i.status === 'done').length.toString()}
                        subValue="Live"
                        trend="up"
                        icon={CheckCircle2}
                    />
                    <StatCard
                        title="System health"
                        value="99.9%"
                        subValue="Stable"
                        trend="up"
                        icon={Timer}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-slate-200/60 transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/30">
                            <div>
                                <CardTitle className="text-lg">Recent Issues</CardTitle>
                                <p className="text-xs text-muted-foreground">Showing the most recent activity across your projects.</p>
                            </div>
                            <Button variant="outline" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {recentIssues.map(issue => (
                                    <div key={issue.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                                                issue.status === 'done' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                            )}>
                                                {issue.status === 'done' ? <CheckCircle2 className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{issue.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{issue.description || "No description provided."}</p>
                                            </div>
                                        </div>
                                        <Badge variant={issue.status === 'done' ? 'success' : 'secondary'} className="hidden sm:inline-flex">{issue.status}</Badge>
                                    </div>
                                ))}
                                {recentIssues.length === 0 && (
                                    <div className="p-12 text-center text-muted-foreground italic">
                                        No recent issue activity found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/60 sticky top-8">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg">Productivity Tip</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                                    <p className="text-sm font-medium text-primary mb-1">Weekly Digest</p>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        You've resolved 4 issues this week. That's 20% more than last week! Keep up the great work.
                                    </p>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions</p>
                                    <Link to="/projects">
                                        <Button variant="outline" className="w-full justify-start text-xs h-9 mb-2">
                                            <Plus className="h-3 w-3 mr-2" /> Create New Project
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="w-full justify-start text-xs h-9">
                                        <Users className="h-3 w-3 mr-2" /> Invite Teammates
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
