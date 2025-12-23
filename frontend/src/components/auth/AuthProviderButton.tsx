import { Phone } from "lucide-react";

type AuthProvider = "google" | "apple" | "microsoft" | "phone";

interface AuthProviderButtonProps {
    provider: AuthProvider;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function AuthProviderButton({ provider, label, onClick, disabled }: AuthProviderButtonProps) {
    const renderIcon = () => {
        switch (provider) {
            case "google":
                return (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24-1.19-2.6z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                );
            case "apple":
                return (
                    <svg className="h-5 w-5 fill-current text-black" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.02-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 3.57-1.35 1.51.56 2.13 1.08 2.65 1.5-3.38 2-2.26 7.09.86 8.79-.9 2.13-1.68 3-2.16 3.29zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                );
            case "microsoft":
                return (
                    <svg className="h-5 w-5" viewBox="0 0 23 23">
                        <path fill="#f35325" d="M1 1h10v10H1z" />
                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                );
            case "phone":
                return <Phone className="h-5 w-5 text-slate-800" />;
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="w-full relative flex items-center h-14 rounded-full border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label={label}
        >
            <div className="absolute left-6 flex items-center justify-center">
                {renderIcon()}
            </div>
            <span className="w-full text-center text-[15px] font-medium text-slate-900">
                {label}
            </span>
        </button>
    );
}
