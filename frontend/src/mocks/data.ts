import type { Project } from "../types/project";
import type { Issue } from "../types/issue";

export const MOCK_PROJECTS: Project[] = [
    {
        id: "1",
        name: "Customer Portal",
        description: "External portal for client support and documentation.",
        owner_id: "u1",
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Mobile App 2.0",
        description: "Next-gen mobile experience with React Native.",
        owner_id: "u1",
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Internal CRM",
        description: "Sales and lead management tool.",
        owner_id: "u1",
        created_at: new Date().toISOString(),
    },
];

export const MOCK_ISSUES: Issue[] = [
    {
        id: "i1",
        project_id: "1",
        title: "Fix login redirect loop",
        description: "Auth callback fails on certain edge cases.",
        status: "in_progress",
        priority: "high",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "i2",
        project_id: "1",
        title: "Update API documentation",
        description: "Sync docs with latest endpoint changes.",
        status: "open",
        priority: "medium",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "i3",
        project_id: "2",
        title: "Implement Push Notifications",
        description: "Integrate Firebase for Android/iOS.",
        status: "open",
        priority: "high",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];
