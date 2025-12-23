import { useState, useMemo, useEffect } from "react";
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
    Briefcase,
    Loader2,
    Trash2
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { cn } from "../lib/utils";
import { fetchProject, deleteProject as deleteProjectApi } from "../api/projects";
import { fetchIssues, createIssue, deleteIssue as deleteIssueApi } from "../api/issues";
import type { Project } from "../types/project";
import type { Issue } from "../types/issue";

type SortField = 'title' | 'status' | 'priority' | 'created_at';
type SortOrder = 'asc' | 'desc';

export default function ProjectDetail() {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newIssue, setNewIssue] = useState({
        title: "",
        description: "",
        priority: "medium" as const,
        status: "open" as const
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (projectId) {
            loadData();
        }
    }, [projectId]);

    async function loadData() {
        if (!projectId) return;
        setIsLoading(true);
        setError(null);
        try {
            const [projectData, issuesData] = await Promise.all([
                fetchProject(projectId),
                fetchIssues(projectId)
            ]);
            setProject(projectData);
            setIssues(issuesData.items);
        } catch (err: any) {
            setError(err.message || "Failed to load project details");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    async function handleCreateIssue(e: React.FormEvent) {
        e.preventDefault();
        if (!projectId || !newIssue.title.trim()) return;

        setIsCreating(true);
        try {
            await createIssue(projectId, newIssue);
            setNewIssue({ title: "", description: "", priority: "medium", status: "open" });
            setIsCreateModalOpen(false);
            const data = await fetchIssues(projectId);
            setIssues(data.items);
        } catch (err: any) {
            alert(err.message || "Failed to create issue");
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeleteIssue(issueId: string) {
        if (!confirm("Are you sure you want to delete this issue?")) return;
        try {
            await deleteIssueApi(issueId);
            setIssues(issues.filter(i => i.id !== issueId));
        } catch (err: any) {
            alert(err.message || "Failed to delete issue");
        }
    }

    async function handleDeleteProject() {
        if (!confirm("Are you sure you want to delete this project? This will delete all its issues.")) return;
        try {
            if (projectId) {
                await deleteProjectApi(projectId);
                window.location.href = "/projects";
            }
        } catch (err: any) {
            alert(err.message || "Failed to delete project");
        }
    }

    const filteredIssues = useMemo(() => {
        return issues
            .filter(i => i.title.toLowerCase().includes(search.toLowerCase()))
            .sort((a: any, b: any) => {
                const valA = a[sortField] || '';
                const valB = b[sortField] || '';
                if (sortOrder === 'asc') return valA > valB ? 1 : -1;
                return valA < valB ? 1 : -1;
            });
    }, [issues, search, sortField, sortOrder]);

    if (isLoading) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Loading project details...</p>
                </div>
            </AppShell>
        );
    }

    if (error || !project) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center h-64">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-xl font-bold">{error || "Project Not Found"}</h2>
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
                        <p className="text-muted-foreground max-w-2xl">{project.description || "No description provided."}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5" onClick={handleDeleteProject}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                        <Button variant="outline" size="sm">Edit Details</Button>
                        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
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
                                    <tbody className="divide-y text-slate-900 font-medium">
                                        {filteredIssues.map(issue => (
                                            <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900">{issue.title}</span>
                                                        <span className="text-xs text-muted-foreground mt-0.5 font-normal tracking-tight">#{issue.id.slice(0, 8)}</span>
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
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteIssue(issue.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredIssues.length === 0 && (
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
                                <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Project Info</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Created At</p>
                                    <p className="text-sm text-slate-900 flex items-center gap-2">
                                        <Clock className="h-3 w-3 text-slate-400" />
                                        {new Date(project.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Project ID</p>
                                    <p className="text-xs font-mono text-slate-500 break-all">{project.id}</p>
                                </div>
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

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Log New Issue"
                className="max-w-xl"
            >
                <form onSubmit={handleCreateIssue} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            value={newIssue.title}
                            onChange={e => setNewIssue({ ...newIssue, title: e.target.value })}
                            placeholder="What needs to be fixed?"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            value={newIssue.description}
                            onChange={e => setNewIssue({ ...newIssue, description: e.target.value })}
                            placeholder="Add more context..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority</label>
                            <Select
                                value={newIssue.priority}
                                onChange={e => setNewIssue({ ...newIssue, priority: e.target.value as any })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={newIssue.status}
                                onChange={e => setNewIssue({ ...newIssue, status: e.target.value as any })}
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isCreating}>Create Issue</Button>
                    </div>
                </form>
            </Modal>
        </AppShell>
    );
}
