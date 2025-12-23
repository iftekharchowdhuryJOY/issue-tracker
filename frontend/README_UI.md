# IssueTracker Frontend

A modern, efficient issue tracking interface built with **React**, **TypeScript**, and **Tailwind CSS**.

## Design System: Direction B (Slate Linear)

This project follows a professional, "Slate Linear" aesthetic:
- **Primary Color**: Interstellar Blue (`hsl(221, 83%, 53%)`)
- **Neutral Palette**: Sophisticated Slates (`slate-50` to `slate-900`)
- **Radius**: 8px (`0.5rem`) for a balanced, modern feel.
- **Shadows**: Subtle, multi-layered natural shadows for depth.

## Project Structure

```text
src/
├── api/            # API client and service definitions
├── auth/           # Authentication context and hooks
├── components/     # High-level components and AppShell
│   └── ui/         # Reusable UI Kit (Button, Input, Card, etc.)
├── lib/            # Utilities (cn helper, etc.)
├── mocks/          # Mock data for rapid prototyping
├── pages/          # Main page views (Dashboard, Projects, etc.)
├── types/          # TypeScript definitions
└── App.tsx         # Main router and app entry
```

## UI Kit Components

We provide a custom, lightweight UI kit in `src/components/ui`. These are intentionally kept simple and dependency-free (using standard HTML/Lucide icons) so you can easily modify them.

| Component | Usage |
| :--- | :--- |
| **Button** | `variant` (default, outline, ghost) + `isLoading` state. |
| **Card** | Flexible sections: `CardHeader`, `CardTitle`, `CardContent`. |
| **Badge** | Small status indicators with semantic variants. |
| **Select** | Styled native dropdown with Lucide indicators. |
| **Checkbox** | Custom themed checkboxes using the `peer` pattern. |
| **Switch** | Animated toggle switches for settings. |
| **Modal** | Simple backdrop-based dialog for forms/alerts. |
| **Tabs** | Stateless tab triggers and content areas. |

## Layout (AppShell)

The `AppShell` component handles the core application layout:
- **Responsive**: Sidebar drawer on mobile, collapsible sidebar on desktop.
- **Viewport Locking**: The root is locked to prevent double-scrollbars; only the main content area scrolls.
- **Dynamic Active States**: Navigation items automatically highlight based on the current URI.

## How to Extend

1. **New API Endpoints**: Add them to `src/api/` and update the types in `src/types/`.
2. **New UI Tokens**: Edit `src/index.css` to change the CSS variables (e.g., `--primary`).
3. **Mock Data**: Update `src/mocks/data.ts` to see changes reflected immediately across the UI.

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.
To connect to the backend, ensure your backend server is running and update the `VITE_API_URL` if necessary.
