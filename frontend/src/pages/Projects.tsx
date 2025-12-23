import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Calendar, Briefcase, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { AppShell } from "../components/AppShell";
import { Modal } from "../components/ui/Modal";
import { fetchProjects, createProject } from "../api/projects";
import type { Project } from "../types/project";

export default function Projects() {
    const [search, setSearch] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDesc, setNewProjectDesc] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
    }, []);

    async function loadProjects() {
        setIsLoading(true);
        try {
            const data = await fetchProjects();
            setProjects(data.items);
        } catch (err: any) {
            setError(err.message || "Failed to load projects");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        setIsCreating(true);
        try {
            await createProject(newProjectName, newProjectDesc);
            setNewProjectName("");
            setNewProjectDesc("");
            setIsCreateModalOpen(false);
            await loadProjects();
        } catch (err: any) {
            alert(err.message || "Failed to create project");
        } finally {
            setIsCreating(false);
        }
    }

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppShell>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage and track your active initiatives.</p>
                </div>
                <Button
                    className="shrink-0 shadow-lg shadow-primary/20"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-slate-200/60 shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground ml-1" />
                <Input
                    placeholder="Search projects..."
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-auto py-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Loading projects...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button variant="outline" onClick={loadProjects}>Retry</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Link key={project.id} to={`/projects/${project.id}`} className="group">
                            <Card className="h-full border-slate-200/60 hover:border-primary/50 hover:shadow-md transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <CardTitle className="text-lg mt-4 group-hover:text-primary transition-colors">{project.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                                        {project.description || "No description provided."}
                                    </p>
                                    <div className="pt-4 flex items-center justify-between border-t text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </div>
                                        <Badge variant="secondary">Active</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-100/50 rounded-xl border-2 border-dashed border-slate-200">
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                                <Search className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-slate-900">No projects found</p>
                                <p className="text-sm text-slate-500">Try adjusting your search or create a new project.</p>
                            </div>
                            <Button variant="outline" onClick={() => setSearch("")}>Clear Search</Button>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Project"
            >
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Name</label>
                        <Input
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)}
                            placeholder="e.g. Website Redesign"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Input
                            value={newProjectDesc}
                            onChange={e => setNewProjectDesc(e.target.value)}
                            placeholder="Briefly describe the project goal"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isCreating}>Create Project</Button>
                    </div>
                </form>
            </Modal>
        </AppShell>
    );
}
