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

export async function fetchProject(id: string): Promise<Project> {
    return apiFetch(`/projects/${id}`);
}

export async function createProject(
    name: string,
    description?: string
) {
    return apiFetch("/projects", {
        method: "POST",
        body: JSON.stringify({ name, description }),
    });
}

export async function updateProject(
    id: string,
    payload: { name?: string; description?: string }
) {
    return apiFetch(`/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export async function deleteProject(id: string) {
    return apiFetch(`/projects/${id}`, {
        method: "DELETE",
    });
}
