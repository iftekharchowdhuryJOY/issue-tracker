export interface Issue {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    status: "open" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    created_at: string;
    updated_at?: string;
}
