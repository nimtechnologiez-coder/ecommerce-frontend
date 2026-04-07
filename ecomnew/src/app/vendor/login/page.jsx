"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Car, Eye, EyeOff, ArrowRight, CheckCircle, ShieldCheck, ExternalLink, Store } from "lucide-react";

function VendorLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams?.get("registered");

    const { data: session, status } = useSession();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already logged in as vendor
    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "VENDOR") {
            // Stay here to show success state
        }
    }, [status, session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        const result = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials for vendor access.");
            setLoading(false);
        } else {
            // Role check happens in useEffect/render via session update
            setLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center bg-white"><span className="spinner w-8 h-8" /></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(255,107,0,0.08), transparent)" }} />
            <div className="w-full max-w-md relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <Link href="/vendor" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl border border-slate-800">
                            <Car size={24} className="text-primary" />
                        </div>
                        <div className="text-left">
                            <div className="font-black text-slate-900 text-xl leading-none tracking-tighter">PHAMON VENDOR</div>
                            <div className="text-[10px] font-bold tracking-[0.2em] text-primary-dark">SELLER PORTAL</div>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {status === "authenticated" && session?.user?.role === "VENDOR" ? "Welcome, Seller" : "Sign in to your Portal"}
                    </h1>
                    <p className="text-sm mt-1 text-slate-500">Manage your parts, orders, and wallet</p>
                </div>

                <div className="card shadow-2xl border-slate-200">
                    {status === "authenticated" && session?.user?.role === "VENDOR" ? (
                        <div className="space-y-6 text-center py-4">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
                                <CheckCircle className="text-green-500" size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Authenticated Successfully</h3>
                                <p className="text-sm text-slate-500 mt-2">You are now logged into the Phamon Network.</p>
                            </div>
                            
                            <a 
                                href={process.env.NEXT_PUBLIC_VENDOR_URL + "/dashboard"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full py-5 flex items-center justify-center gap-3 bg-primary-dark hover:bg-slate-900 text-white shadow-xl shadow-primary/20 group"
                            >
                                <Store size={20} />
                                <span>Go to Vendor Dashboard</span>
                                <ExternalLink size={18} className="transition-transform group-hover:translate-x-1" />
                            </a>
                            
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Opens dashboard at port 3002
                            </p>
                        </div>
                    ) : (
                        <>
                            {isRegistered && (
                                <div className="mb-6 p-4 rounded-2xl flex items-center gap-3 bg-green-50 border border-green-100 animate-slide-up">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-green-800">Registration Received!</div>
                                        <div className="text-xs text-green-600 font-medium">Log in to complete your profile verification.</div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="px-4 py-3 rounded-xl text-sm bg-red-50 border border-red-100 text-red-600 font-medium">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Business Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        className="input-field border-slate-200 focus:border-primary-dark" 
                                        placeholder="vendor@example.com" 
                                        value={form.email} 
                                        onChange={e => setForm({ ...form, email: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            required 
                                            className="input-field border-slate-200 focus:border-primary-dark pr-10" 
                                            placeholder="••••••••" 
                                            value={form.password} 
                                            onChange={e => setForm({ ...form, password: e.target.value })} 
                                        />
                                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200">
                                    {loading ? <span className="spinner w-5 h-5 border-white/30 border-t-white" /> : <><span>Sign In to Access</span><ArrowRight size={18} /></>}
                                </button>
                            </form>

                            <div className="divider my-8" />
                            
                            <div className="flex flex-col gap-3">
                                <Link href="/vendor/register" className="w-full text-center py-3 rounded-xl text-sm font-bold border border-primary/20 text-primary-dark hover:bg-primary/5 transition-all">
                                    New Seller? Create Account
                                </Link>
                                <Link href="/login" className="w-full text-center py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-all">
                                    Are you a Customer? Sign in here
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} /> Phamon Secure Authentication
                </div>
            </div>
        </div>
    );
}

export default function VendorLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><span className="spinner w-8 h-8" /></div>}>
            <VendorLoginForm />
        </Suspense>
    );
}
