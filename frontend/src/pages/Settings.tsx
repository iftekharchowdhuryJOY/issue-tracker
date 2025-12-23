import {
    User,
    Bell,
    Shield,
    Globe,
    CreditCard,
    Mail,
    Smartphone
} from "lucide-react";
import { AppShell } from "../components/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { cn } from "../lib/utils";

export default function Settings() {
    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'display', label: 'Display', icon: Globe },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

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
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                                    section.id === 'profile'
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
                        <Card className="border-slate-200/60 shadow-sm">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle className="text-lg">Public Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-8">
                                    <div className="h-24 w-24 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500 border-4 border-white shadow-lg overflow-hidden shrink-0">
                                        <User className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-slate-900 text-lg">Your Photo</h3>
                                        <p className="text-sm text-slate-500">This will be displayed on your profile. PNG, JPG or GIF (max. 800x800px)</p>
                                        <div className="flex gap-2 pt-1">
                                            <Button variant="secondary" size="sm">Update Photo</Button>
                                            <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Display Name</label>
                                        <Input placeholder="jdoe" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input className="pl-9" placeholder="john@company.com" disabled />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">Email changes require verified domain admin approval.</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t flex justify-end gap-3">
                                    <Button variant="outline">Discard</Button>
                                    <Button>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200/60 shadow-sm">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle className="text-lg">Communication Prefs</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex gap-4">
                                        <Smartphone className="h-5 w-5 text-primary mt-1" />
                                        <div>
                                            <p className="text-sm font-semibold">Push Notifications</p>
                                            <p className="text-xs text-slate-500">Receive alerts on your mobile device.</p>
                                        </div>
                                    </div>
                                    <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer shadow-inner">
                                        <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
