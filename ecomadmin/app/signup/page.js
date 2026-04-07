"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
            } else {
                router.push("/login?signup=success");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-8 card shadow-2xl shadow-primary/5">
                <h1 className="text-2xl font-black mb-6 text-center text-slate-900 uppercase tracking-tight">Create Admin</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-1 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
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
                    <div>
                        <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest px-1 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                    <div className="text-center mt-6">
                        <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
