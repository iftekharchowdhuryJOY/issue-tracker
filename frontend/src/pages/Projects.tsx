import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects, createProject } from "../api/projects";
import type { Project } from "../types/project";
import { useAuth } from "../auth/AuthContext";

export default function Projects() {
    const { logout } = useAuth();

    // List State
    const [projects, setProjects] = useState<Project[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
    }, [page]);

    async function loadProjects() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProjects(page, pageSize);
            setProjects(data.items);
            setTotal(data.total);
        } catch (err: any) {
            setError("Failed to load projects");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateProject(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) {
            setCreateError("Project name is required");
            return;
        }

        setCreating(true);
        setCreateError(null);
        try {
            await createProject(name, description);
            setName("");
            setDescription("");
            setPage(1); // Reset to first page
            await loadProjects(); // Refresh list
        } catch (err: any) {
            setCreateError("Failed to create project");
        } finally {
            setCreating(false);
        }
    }

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div>
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Projects</h1>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    Logout
                </button>
            </header>

            {/* Create Project Section */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-10 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                        <input
                            placeholder="Project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={creating}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={creating}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 min-h-[80px]"
                        />
                    </div>
                    {createError && <p className="text-red-500 text-sm">{createError}</p>}
                    <button
                        type="submit"
                        disabled={creating}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {creating ? "Creating..." : "Create Project"}
                    </button>
                </form>
            </section>

            {/* Projects List Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
                {loading && <p className="text-gray-500">Loading projects...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && projects.length === 0 && (
                    <p className="text-gray-500">No projects yet.</p>
                )}

                <ul className="space-y-3">
                    {projects.map((project) => (
                        <li key={project.id} className="bg-white p-4 rounded shadow-sm">
                            <Link
                                to={`/projects/${project.id}`}
                                className="text-lg font-medium text-blue-600 hover:underline block"
                            >
                                {project.name}
                            </Link>
                            {project.description && (
                                <p className="text-gray-600 mt-1">{project.description}</p>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                <footer className="mt-8 flex items-center gap-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages || 1}
                    </span>

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </footer>
            </section>
        </div>
    );
}
