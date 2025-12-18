import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchIssues } from "../api/issues";
import type { Issue } from "../types/issue";
import { createIssue } from "../api/issues";
import { updateIssueStatus } from "../api/issues";
import { deleteIssue } from "../api/issues";



export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create Issue State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("open");
    const [priority, setPriority] = useState("low");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] =
        useState<"open" | "in_progress" | "done" | "">("");

    const [priorityFilter, setPriorityFilter] =
        useState<"low" | "medium" | "high" | "">("");

    // List Loading logic
    async function loadIssues() {
        if (!projectId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await fetchIssues(projectId, page, pageSize, {
                status: statusFilter || undefined,
                priority: priorityFilter || undefined,
            });
            setIssues(data.items);
            setTotal(data.total);
        } catch {
            setError("Failed to load issues");
        } finally {
            setLoading(false);
        }
    }

    // Reset pagination when filters change
    useEffect(() => {
        setPage(1);
    }, [statusFilter, priorityFilter]);

    useEffect(() => {
        if (projectId) {
            loadIssues();
        }
    }, [page, projectId, statusFilter, priorityFilter]);

    useEffect(() => {
        if (issues.length === 0 && page > 1) {
            setPage((p) => p - 1);
        }
    }, [issues, page]);

    async function handleCreateIssue(e: React.FormEvent) {
        e.preventDefault();

        if (!projectId || !title.trim()) {
            setCreateError("Issue title is required");
            return;
        }

        setCreating(true);
        setCreateError(null);

        try {
            await createIssue(projectId, {
                title,
                description,
                status: status as any,
                priority: priority as any,
            });

            // reset form
            setTitle("");
            setDescription("");
            setStatus("open");
            setPriority("low");

            setPage(1);
            await loadIssues(); // refresh issues
        } catch {
            setCreateError("Failed to create issue");
        } finally {
            setCreating(false);
        }
    }

    async function handleStatusChange(
        issueId: string,
        newStatus: "open" | "in_progress" | "done"
    ) {
        try {
            await updateIssueStatus(issueId, newStatus);
            setIssues((prev) =>
                prev.map((issue) =>
                    issue.id === issueId
                        ? { ...issue, status: newStatus }
                        : issue
                )
            );
        } catch {
            alert("Failed to update issue status");
        }
    }

    async function handleDeleteIssue(issueId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this issue? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            await deleteIssue(issueId);

            setIssues((prev) =>
                prev.filter((issue) => issue.id !== issueId)
            );

            setTotal((t) => t - 1);
        } catch {
            alert("Failed to delete issue");
        }
    }

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <header style={{ marginBottom: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>← Back to Projects</Link>
                <h1 style={{ marginTop: '10px' }}>Project Issues</h1>
            </header>

            {/* Create Issue Section */}
            <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>Create New Issue</h3>
                <form onSubmit={handleCreateIssue}>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            placeholder="Issue title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                        <div>
                            <label style={{ marginRight: '10px' }}>Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={creating}
                                style={{ padding: '5px' }}
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ marginRight: '10px' }}>Priority:</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                disabled={creating}
                                style={{ padding: '5px' }}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {createError && <p style={{ color: 'red' }}>{createError}</p>}

                    <button type="submit" disabled={creating}>
                        {creating ? "Creating..." : "Create Issue"}
                    </button>
                </form>
            </section>

            {/* Filters Section */}
            <section style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <h3>Filters:</h3>
                <div>
                    <label style={{ marginRight: '10px' }}>Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        style={{ padding: '5px' }}
                    >
                        <option value="">All</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div>
                    <label style={{ marginRight: '10px' }}>Priority</label>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        style={{ padding: '5px' }}
                    >
                        <option value="">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </section>

            {/* Issues List Section */}
            <section>
                <h3>Issues List</h3>
                {loading && <p>Loading issues...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && issues.length === 0 && (
                    <p>No issues found matching these filters.</p>
                )}

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {issues.map((issue) => (
                        <li key={issue.id} style={{ marginBottom: '15px', padding: '15px', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <strong style={{ fontSize: '1.1em' }}>{issue.title}</strong>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <label>
                                        Status:
                                        <select
                                            value={issue.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    issue.id,
                                                    e.target.value as any
                                                )
                                            }
                                        >
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </label>

                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8em',
                                        backgroundColor: issue.priority === 'high' ? '#f8d7da' : '#f1f1f1'
                                    }}>
                                        {issue.priority}
                                    </span>

                                    <button
                                        onClick={() => handleDeleteIssue(issue.id)}
                                        style={{
                                            color: "red",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "0.8em",
                                            padding: "2px 5px"
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {issue.description && (
                                <p style={{ margin: '10px 0 0', color: '#666' }}>{issue.description}</p>
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
