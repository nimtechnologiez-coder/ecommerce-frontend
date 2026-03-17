"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Eye, EyeOff, ArrowRight, Store, CheckCircle } from "lucide-react";

function VendorRegisterForm() {
    const router = useRouter();
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        phone: "",
        businessName: "",
        role: "VENDOR"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setLoading(false);
        if (res.ok) {
            router.push("/vendor/login?registered=1");
        } else {
            const data = await res.json();
            setError(data.error || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, var(--primary-light), transparent)" }} />
            <div className="w-full max-w-md relative z-10 animate-fade-in">
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
                    <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Join the Elite Network</h1>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Register your micro-store and start selling premium parts</p>
                </div>

                <div className="card shadow-2xl border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                                {error}
                            </div>
                        )}
                        
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-2">
                            <div className="flex items-center gap-3 text-primary-dark font-bold text-xs uppercase tracking-widest">
                                <Store size={14} /> Vendor Account Mode
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Business Name</label>
                            <div className="relative">
                                <Store size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    required 
                                    className="input-field pl-10" 
                                    placeholder="Phamon Spare Parts Ltd" 
                                    value={form.businessName} 
                                    onChange={e => setForm({ ...form, businessName: e.target.value })} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Contact Person</label>
                            <input 
                                type="text" 
                                required 
                                className="input-field" 
                                placeholder="John Doe" 
                                value={form.name} 
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email address</label>
                            <input 
                                type="email" 
                                required 
                                className="input-field" 
                                placeholder="business@example.com" 
                                value={form.email} 
                                onChange={e => setForm({ ...form, email: e.target.value })} 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Phone (Mobile Money)</label>
                            <input 
                                type="tel" 
                                className="input-field" 
                                placeholder="+256 700 000 000" 
                                value={form.phone} 
                                onChange={e => setForm({ ...form, phone: e.target.value })} 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    minLength={8} 
                                    className="input-field pr-10" 
                                    placeholder="Min 8 characters" 
                                    value={form.password} 
                                    onChange={e => setForm({ ...form, password: e.target.value })} 
                                />
                                <button 
                                    type="button" 
                                    className="absolute right-3 top-1/2 -translate-y-1/2" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="spinner w-4 h-4" /> : <><span>Register Micro-Store</span><ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div className="divider" />
                    <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
                        Already have an account?{" "}
                        <Link href="/vendor/login" className="font-semibold hover:underline text-primary-dark">Sign in</Link>
                    </p>
                    <p className="text-center text-sm mt-3 pt-3 border-t border-slate-100" style={{ color: "var(--text-muted)" }}>
                        Looking to shop instead?{" "}
                        <Link href="/register" className="font-semibold hover:underline text-primary-dark">Customer Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VendorRegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white"><span className="spinner w-8 h-8" /></div>}>
            <VendorRegisterForm />
        </Suspense>
    );
}
