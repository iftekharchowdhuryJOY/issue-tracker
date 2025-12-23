import { AuthHeader } from "../components/auth/AuthHeader";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="h-[100dvh] w-full bg-slate-50 flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="w-full max-w-md space-y-8">
                <AuthHeader />
                {children}
            </div>
        </div>
    );
}
