import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Calendar, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { AppShell } from "../components/AppShell";
import { MOCK_PROJECTS } from "../mocks/data";
import type { Project } from "../types/project";

export default function Projects() {
    const [search, setSearch] = useState("");
    const [projects] = useState<Project[]>(MOCK_PROJECTS);

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
                <Button className="shrink-0 shadow-lg shadow-primary/20">
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
        </AppShell>
    );
}
