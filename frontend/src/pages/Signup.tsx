import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockSignup } from "../mocks/authMock";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Basic Validation
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isNameValid = name.trim().length >= 2;
    const isValid = isEmailValid && isNameValid;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isValid) return;

        setIsLoading(true);
        setError(null);

        try {
            await mockSignup(email, name);
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 5000); // Redirect after 5 seconds or let them click logic
        } catch (err: any) {
            setError(err.message || "Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-sm border border-slate-200/60 shadow-sm">
                    <CardContent className="pt-10 pb-8 px-8 text-center space-y-4">
                        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-slate-900">Check your email</h2>
                            <p className="text-sm text-slate-500">
                                We sent a sign-in link to <span className="font-medium text-slate-700">{email}</span>
                            </p>
                        </div>
                        <div className="pt-4">
                            <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                                Back to Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-sm border border-slate-200/60 shadow-sm bg-white">
                <CardContent className="pt-8 pb-8 px-8 space-y-6">
                    <div className="text-center space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
                        <p className="text-sm text-slate-500">Note: This is a demo simulation.</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-rose-600 bg-rose-50 rounded-md">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 border-slate-300 focus-visible:ring-slate-400 focus-visible:ring-offset-0"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-sm font-medium text-slate-700">
                                Full name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 border-slate-300 focus-visible:ring-slate-400 focus-visible:ring-offset-0"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isValid || isLoading}
                        >
                            {isLoading ? "Continuing..." : "Continue"}
                        </Button>

                        <div className="text-center">
                            <p className="text-xs text-slate-500">
                                We'll email you a sign-in link. No password needed.
                            </p>
                        </div>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
