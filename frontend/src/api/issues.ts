import { apiFetch } from "./client";
import type { Page } from "../types/page";
import type { Issue } from "../types/issue";

export function fetchIssues(
    projectId: string,
    page = 1,
    pageSize = 10,
    filters?: {
        status?: "open" | "in_progress" | "done";
        priority?: "low" | "medium" | "high";
    }
) {
    const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
    });

    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);

    return apiFetch(
        `/issues/projects/${projectId}?${params.toString()}`
    );
}


export async function createIssue(
    projectId: string,
    payload: {
        title: string;
        description?: string;
        status?: "open" | "in_progress" | "done";
        priority?: "low" | "medium" | "high";
    }
) {
    return apiFetch(`/issues/projects/${projectId}`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateIssueStatus(
    issueId: string,
    status: "open" | "in_progress" | "done"
) {
    return apiFetch(`/issues/${issueId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}

export async function deleteIssue(issueId: string) {
    return apiFetch(`/issues/${issueId}`, {
        method: "DELETE",
    });
}
