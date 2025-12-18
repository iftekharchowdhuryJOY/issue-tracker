import { apiFetch } from "./client";
import type { Page } from "../types/page";
import type { Issue } from "../types/issue";

export function fetchIssues(
    projectId: string,
    page = 1,
    pageSize = 10
): Promise<Page<Issue>> {
    return apiFetch(
        `/issues/projects/${projectId}?page=${page}&page_size=${pageSize}`
    );
}
