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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Projects</h1>
                <button onClick={logout}>Logout</button>
            </header>

            {/* Create Project Section */}
            <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Create New Project</h2>
                <form onSubmit={handleCreateProject}>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            placeholder="Project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={creating}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <textarea
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={creating}
                            style={{ width: '100%', padding: '8px', minHeight: '60px' }}
                        />
                    </div>
                    {createError && <p style={{ color: 'red' }}>{createError}</p>}
                    <button type="submit" disabled={creating}>
                        {creating ? "Creating..." : "Create Project"}
                    </button>
                </form>
            </section>

            {/* Projects List Section */}
            <section>
                <h2>Your Projects</h2>
                {loading && <p>Loading projects...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && projects.length === 0 && (
                    <p>No projects yet.</p>
                )}

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {projects.map((project) => (
                        <li key={project.id} style={{ marginBottom: '15px', padding: '15px', borderBottom: '1px solid #eee' }}>
                            <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                                <strong style={{ fontSize: '1.2em' }}>{project.name}</strong>
                            </Link>
                            {project.description && (
                                <p style={{ margin: '5px 0 0', color: '#666' }}>{project.description}</p>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Pagination */}
                <footer style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages || 1}
                    </span>

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </footer>
            </section>
        </div>
    );
}
