import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchIssues } from "../api/issues";
import type { Issue } from "../types/issue";

export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();

    const [issues, setIssues] = useState<Issue[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (projectId) {
            loadIssues();
        }
    }, [page, projectId]);

    async function loadIssues() {
        if (!projectId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await fetchIssues(projectId, page, pageSize);
            setIssues(data.items);
            setTotal(data.total);
        } catch {
            setError("Failed to load issues");
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div>
            <header>
                <Link to="/">← Back to Projects</Link>
                <h2>Issues</h2>
            </header>

            {loading && <p>Loading issues…</p>}
            {error && <p>{error}</p>}

            {!loading && issues.length === 0 && (
                <p>No issues for this project.</p>
            )}

            <ul>
                {issues.map((issue) => (
                    <li key={issue.id}>
                        <strong>{issue.title}</strong>
                        <p>Status: {issue.status}</p>
                        <p>Priority: {issue.priority}</p>
                        {issue.description && <p>{issue.description}</p>}
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
