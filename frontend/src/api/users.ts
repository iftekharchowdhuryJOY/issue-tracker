import { apiFetch } from "./client";

export async function fetchMe() {
    return apiFetch("/users/me");
}

export async function updateMe(payload: { email?: string; password?: string }) {
    return apiFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}
