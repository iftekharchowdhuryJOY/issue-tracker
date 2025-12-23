import { apiFetch } from "./client";

export async function login(email: string, password: string) {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function signup(email: string, password: string) {
    return apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}
