import { useState, useEffect } from "react";
import {
    User,
    Bell,
    Shield,
    Globe,
    CreditCard,
    Mail,
    Smartphone,
    Loader2,
    Lock
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Switch } from "../components/ui/Switch";
import { cn } from "../lib/utils";
import { fetchMe, updateMe } from "../api/users";

export default function Settings() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [notifications, setNotifications] = useState({
        push: true,
        email: true,
        digest: false
    });

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        setIsLoading(true);
        try {
            const user = await fetchMe();
            setEmail(user.email);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSave() {
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const payload: any = { email };
            if (password) payload.password = password;

            await updateMe(payload);
            setSuccess("Settings updated successfully!");
            setPassword("");
        } catch (err: any) {
            setError(err.message || "Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    }

    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'display', label: 'Display', icon: Globe },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    if (isLoading) {
        return (
            <AppShell>
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Loading settings...</p>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-64 space-y-1">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                                    section.id === activeSection
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-slate-100"
                                )}
                            >
                                <section.icon className="h-4 w-4" />
                                {section.label}
                            </button>
                        ))}
                    </aside>

                    <div className="flex-1 space-y-6">
                        {activeSection === 'profile' ? (
                            <div className="space-y-6">
                                <Card className="border-slate-200/60 shadow-sm">
                                    <CardHeader className="border-b bg-slate-50/50">
                                        <CardTitle className="text-lg">Public Profile</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-6">
                                        {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>}
                                        {success && <div className="p-3 bg-emerald-100 text-emerald-700 text-sm rounded-md">{success}</div>}

                                        <div className="flex flex-col md:flex-row md:items-center gap-8">
                                            <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border-4 border-white shadow-lg overflow-hidden shrink-0">
                                                <User className="h-10 w-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-slate-900 text-lg">Your Photo</h3>
                                                <p className="text-sm text-slate-500">This will be displayed on your profile. PNG or JPG.</p>
                                                <div className="flex gap-2 pt-1">
                                                    <Button variant="secondary" size="sm">Update Photo</Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-9"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium">Update Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="password"
                                                        className="pl-9"
                                                        placeholder="Leave blank to keep current"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t flex justify-end gap-3">
                                            <Button variant="outline" onClick={loadUser}>Reset</Button>
                                            <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200/60 shadow-sm">
                                    <CardHeader className="border-b bg-slate-50/50">
                                        <CardTitle className="text-lg">Communication Preferences</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100/50 cursor-pointer" onClick={() => setNotifications({ ...notifications, push: !notifications.push })}>
                                            <div className="flex gap-4">
                                                <Smartphone className="h-5 w-5 text-primary mt-1" />
                                                <div>
                                                    <p className="text-sm font-semibold">Push Notifications</p>
                                                    <p className="text-xs text-slate-500">Receive alerts on your mobile device.</p>
                                                </div>
                                            </div>
                                            <Switch checked={notifications.push} onChange={() => { }} />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100/50 cursor-pointer" onClick={() => setNotifications({ ...notifications, email: !notifications.email })}>
                                            <div className="flex gap-4">
                                                <Mail className="h-5 w-5 text-primary mt-1" />
                                                <div>
                                                    <p className="text-sm font-semibold">Email Alerts</p>
                                                    <p className="text-xs text-slate-500">Get important updates via email.</p>
                                                </div>
                                            </div>
                                            <Switch checked={notifications.email} onChange={() => { }} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card className="p-12 text-center text-muted-foreground italic border-dashed border-2">
                                This section is coming soon!
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
