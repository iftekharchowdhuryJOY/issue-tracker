import { apiFetch } from "./client";
import type { Page } from "../types/page";
import type { Project } from "../types/project";

export function fetchProjects(
    page = 1,
    pageSize = 10
): Promise<Page<Project>> {
    return apiFetch(
        `/projects?page=${page}&page_size=${pageSize}`
    );
}
