"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const signupSuccess = searchParams.get("signup") === "success";
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            setError("Invalid credentials or not an admin.");
        } else {
            router.push("/");
        }
    };

    return (
        <div className="w-full max-w-md p-8 card shadow-2xl shadow-primary/5">
            <h1 className="text-2xl font-black mb-6 text-center text-slate-900 uppercase tracking-tight">Admin Portal</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}
                {signupSuccess && (
                    <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-bold text-center">
                        Account created! Please login.
                    </div>
                )}
                <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-1 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="input-field"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-1 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="input-field"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
                    {loading ? "Signing in..." : "Login"}
                </button>
                <div className="text-center mt-6">
                    <Link href="/signup" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                        Don't have an account? Sign up
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Suspense fallback={<div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
