import { useState } from "react";
import { AuthProviderButton } from "./AuthProviderButton";

export function AuthProviders() {
    const [toast, setToast] = useState<{ visible: boolean; provider: string | null }>(
        { visible: false, provider: null }
    );

    const handleProviderClick = (provider: string) => {
        setToast({ visible: true, provider });
        setTimeout(() => setToast({ visible: false, provider: null }), 3000);
    };

    return (
        <div className="w-full space-y-4">
            {toast.visible && (
                <div className="fixed top-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 z-50">
                    Mock login: {toast.provider}
                </div>
            )}

            <AuthProviderButton
                provider="google"
                label="Continue with Google"
                onClick={() => handleProviderClick("Google")}
            />
            <AuthProviderButton
                provider="apple"
                label="Continue with Apple"
                onClick={() => handleProviderClick("Apple")}
            />

            <div className="h-px bg-slate-200 w-full my-4" />

            <AuthProviderButton
                provider="microsoft"
                label="Continue with Microsoft"
                onClick={() => handleProviderClick("Microsoft")}
            />
            <AuthProviderButton
                provider="phone"
                label="Continue with phone"
                onClick={() => handleProviderClick("Phone")}
            />
        </div>
    );
}
