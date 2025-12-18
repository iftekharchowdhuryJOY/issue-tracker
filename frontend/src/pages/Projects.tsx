import { useEffect, useState } from "react";
import { fetchProjects } from "../api/projects";
import type { Project } from "../types/project";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Projects() {
    const { logout } = useAuth();

    const [projects, setProjects] = useState<Project[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div>
            <header>
                <h1>Projects</h1>
                <button onClick={logout}>Logout</button>
            </header>

            {loading && <p>Loading projects…</p>}
            {error && <p>{error}</p>}

            {!loading && projects.length === 0 && (
                <p>No projects yet.</p>
            )}

            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        <Link to={`/projects/${project.id}`}>
                            <strong>{project.name}</strong>
                        </Link>
                        {project.description && (
                            <p>{project.description}</p>
                        )}
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <footer>
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
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </footer>
        </div>
    );
}
