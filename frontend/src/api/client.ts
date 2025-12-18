const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw data;
    }

    return data;
}
