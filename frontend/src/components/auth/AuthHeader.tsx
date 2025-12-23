import { CheckSquare } from "lucide-react";

export function AuthHeader() {
    return (
        <div className="text-center space-y-2 mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 mb-4">
                <CheckSquare className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">IssueTrack</h1>
            <p className="text-muted-foreground">Ship clarity, build faster.</p>
        </div>
    );
}
