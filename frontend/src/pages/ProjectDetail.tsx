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
        <div>
            <header className="mb-6">
                <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to Projects</Link>
                <h1 className="text-2xl font-semibold mt-2">Project Issues</h1>
            </header>

            {/* Create Issue Section */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-10 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Create New Issue</h2>
                <form onSubmit={handleCreateIssue} className="space-y-4">
                    <div>
                        <input
                            placeholder="Issue title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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

                    <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-sm">
                            <label className="font-medium text-gray-700">Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={creating}
                                className="border rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <label className="font-medium text-gray-700">Priority:</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                disabled={creating}
                                className="border rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {createError && <p className="text-red-500 text-sm">{createError}</p>}

                    <button
                        type="submit"
                        disabled={creating}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {creating ? "Creating..." : "Create Issue"}
                    </button>
                </form>
            </section>

            {/* Filters Section */}
            <section className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap items-center gap-6 border border-gray-200">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600">Filters:</h3>
                <div className="flex items-center gap-2 text-sm">
                    <label className="text-gray-700">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="border rounded px-2 py-1 bg-white"
                    >
                        <option value="">All</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <label className="text-gray-700">Priority</label>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        className="border rounded px-2 py-1 bg-white"
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
                <h2 className="text-xl font-semibold mb-4">Issues</h2>
                {loading && <p className="text-gray-500">Loading issues...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && issues.length === 0 && (
                    <p className="text-gray-500 italic">No issues found matching these filters.</p>
                )}

                <ul className="space-y-4">
                    {issues.map((issue) => (
                        <li key={issue.id} className="bg-white p-4 rounded shadow-sm border border-gray-100 space-y-2">
                            <div className="flex justify-between items-center">
                                <strong className="text-lg text-gray-900">{issue.title}</strong>
                                <button
                                    onClick={() => handleDeleteIssue(issue.id)}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="flex gap-4 text-sm items-center">
                                <label className="text-gray-700">
                                    Status
                                    <select
                                        value={issue.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                issue.id,
                                                e.target.value as any
                                            )
                                        }
                                        className="ml-2 border rounded px-2 py-1 bg-white focus:outline-none"
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </label>

                                <span className="text-gray-500">
                                    Priority: <span className={`font-medium ${issue.priority === 'high' ? 'text-red-600' : 'text-gray-700'}`}>{issue.priority}</span>
                                </span>
                            </div>

                            {issue.description && (
                                <p className="text-gray-600 text-sm leading-relaxed">{issue.description}</p>
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
