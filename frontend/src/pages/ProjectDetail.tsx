import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    Clock,
    AlertCircle,
    Briefcase
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { AppShell } from "../components/AppShell";
import { MOCK_PROJECTS, MOCK_ISSUES } from "../mocks/data";
import { cn } from "../lib/utils";

type SortField = 'title' | 'status' | 'priority' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function ProjectDetail() {
    const { projectId } = useParams();
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    const projectIssues = MOCK_ISSUES.filter(i => i.project_id === projectId);

    const sortedIssues = useMemo(() => {
        return [...projectIssues]
            .filter(i => i.title.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const valA = a[sortField] || '';
                const valB = b[sortField] || '';
                if (sortOrder === 'asc') return valA > valB ? 1 : -1;
                return valA < valB ? 1 : -1;
            });
    }, [projectIssues, search, sortField, sortOrder]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    if (!project) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center h-64">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-xl font-bold">Project Not Found</h2>
                    <Link to="/projects">
                        <Button variant="link" className="mt-2 text-primary">Back to Projects</Button>
                    </Link>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="space-y-6">
                <Link to="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">v1.2.0</Badge>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Edit Details</Button>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            New Issue
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <CardTitle className="text-lg">Issues</CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Filter issues..."
                                            size={1}
                                            className="pl-9 h-9 w-[200px]"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" size="icon" className="h-9 w-9">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 border-b text-muted-foreground font-medium">
                                        <tr>
                                            <th className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('title')}>
                                                <div className="flex items-center gap-2">
                                                    Title
                                                    <ArrowUpDown className="h-3 w-3" />
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('status')}>
                                                <div className="flex items-center gap-2">
                                                    Status
                                                    <ArrowUpDown className="h-3 w-3" />
                                                </div>
                                            </th>
                                            <th className="px-6 py-4">Priority</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {sortedIssues.map(issue => (
                                            <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900">{issue.title}</span>
                                                        <span className="text-xs text-muted-foreground mt-0.5">#{issue.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={issue.status === 'done' ? 'success' : 'secondary'} className="capitalize">
                                                        {issue.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                        issue.priority === 'high' ? "bg-red-100 text-red-700" :
                                                            issue.priority === 'medium' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                                                    )}>
                                                        {issue.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {sortedIssues.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                                                    No issues found in this project.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3 border-b">
                                <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <Clock className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium text-slate-800">New issue created</p>
                                            <p className="text-slate-500 text-xs">2 hours ago</p>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="ghost" className="w-full text-xs text-muted-foreground h-8">View full history</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Briefcase className="h-12 w-12 text-primary" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold text-primary">Automation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-primary/70 leading-relaxed">
                                    Your project is currently sync'ed with GitHub. <br />
                                    <span className="font-bold underline cursor-pointer mt-1 inline-block">Configure Webhooks</span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
