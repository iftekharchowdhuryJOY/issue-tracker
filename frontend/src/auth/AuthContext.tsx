import { createContext, useContext, useState } from "react";
import { login as apiLogin } from "../api/auth";

type User = {
    email: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState(localStorage.getItem("access_token"));
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    async function login(email: string, password: string) {
        const res = await apiLogin(email, password);
        const userData = { email };
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(res.access_token);
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("AuthContext missing");
    return ctx;
}
