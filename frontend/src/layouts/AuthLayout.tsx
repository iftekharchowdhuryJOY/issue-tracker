import { AuthHeader } from "../components/auth/AuthHeader";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md">
                <AuthHeader />
                {children}
            </div>
        </div>
    );
}
