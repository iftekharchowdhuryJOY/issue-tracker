import { createContext, useContext, useState } from "react";
import { login as apiLogin } from "../api/auth";

type AuthContextType = {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState(
        localStorage.getItem("access_token")
    );

    async function login(email: string, password: string) {
        const res = await apiLogin(email, password);
        localStorage.setItem("access_token", res.access_token);
        setToken(res.access_token);
    }

    function logout() {
        localStorage.removeItem("access_token");
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("AuthContext missing");
    return ctx;
}
