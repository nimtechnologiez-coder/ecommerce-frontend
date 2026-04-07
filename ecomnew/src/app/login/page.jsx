"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Car, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams?.get("registered");

    const { data: session, status } = useSession();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (status === "authenticated") {
            if (session.user.role === "VENDOR") {
                router.push("/vendor");
            } else {
                router.push("/");
            }
        }
    }, [status, router, session]);

    if (status === "authenticated" || status === "loading") {
        return <div className="min-h-screen flex items-center justify-center bg-white"><span className="spinner w-8 h-8" /></div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const result = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        });
        setLoading(false);
        if (result?.error) {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, var(--primary-light), transparent)" }} />
            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center border border-slate-100 shadow-sm">
                            <Car size={22} className="text-slate-900" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-slate-900 text-xl leading-none">PHAMON</div>
                            <div className="text-[10px] font-medium text-primary-dark">AUTOMOTIVES</div>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Welcome back</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Sign in to your shopper account</p>
                </div>

                <div className="card">
                    {isRegistered && (
                        <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 bg-green-50 border border-green-100 animate-slide-up">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle className="text-green-600" size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-green-800">Account Ready!</div>
                                <div className="text-xs text-green-600 font-medium">Please sign in to start shopping.</div>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email address</label>
                            <input type="email" required className="input-field" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} required className="input-field pr-10" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)} style={{ color: "var(--text-muted)" }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full text-center flex items-center justify-center gap-2">
                            {loading ? <span className="spinner w-4 h-4" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div className="divider" />
                    <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold transition-colors hover:underline text-primary-dark">Create one</Link>
                    </p>
                    <p className="text-center text-sm mt-3 pt-3 border-t border-slate-100" style={{ color: "var(--text-muted)" }}>
                        Are you a vendor?{" "}
                        <Link href="/vendor" className="font-bold text-primary-dark hover:underline">Seller Central</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><span className="spinner w-8 h-8" /></div>}>
            <LoginForm />
        </Suspense>
    );
}
