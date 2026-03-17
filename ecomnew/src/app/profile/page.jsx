"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Mail, Phone, Calendar, Shield, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/profile");
        } else if (status === "authenticated") {
            fetchProfile();
        }
    }, [status]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/profile");
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setFormData({
                    name: data.name || "",
                    phone: data.phone || "",
                });
            } else {
                setError("Failed to load profile data.");
            }
        } catch (err) {
            setError("An error occurred while fetching profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                setSuccess("Profile updated successfully!");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to update profile.");
            }
        } catch (err) {
            setError("An error occurred while updating profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || status === "loading") {
        return (
            <div style={{ background: "var(--bg-dark)" }}>
                <Navbar />
                <div className="min-h-[70vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            
            <main className="page-container py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Account <span className="gradient-text italic">Profile</span></h1>
                        <p className="text-slate-500">Manage your personal information and account security.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card text-center p-8 border-none shadow-xl shadow-slate-200/50">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                                    <User size={48} className="text-primary-dark" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                                <p className="text-xs font-black tracking-widest text-primary-dark uppercase mb-4">{user?.role}</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                    <Shield size={12} /> VERIFIED ACCOUNT
                                </div>
                            </div>

                            <div className="card p-6 space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                        <Calendar size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Joined On</div>
                                        <div className="font-bold text-slate-700">{new Date(user?.createdAt).toLocaleDateString('en-UG', { month: 'long', year: 'numeric' })}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                        <Shield size={16} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Security Status</div>
                                        <div className="font-bold text-emerald-600">Active & Protected</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleUpdate} className="card p-8 border-none shadow-xl shadow-slate-200/50 space-y-6">
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-2">
                                    <User size={20} className="text-primary-dark" /> PERSONAL INFORMATION
                                </h3>

                                {error && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-4">
                                        <AlertCircle size={20} />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 animate-in fade-in slide-in-from-top-4">
                                        <CheckCircle2 size={20} />
                                        <p className="text-sm font-medium">{success}</p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className="text-slate-300 group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field (Read-only) */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address (Read Only)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-slate-300" />
                                            </div>
                                            <input
                                                type="email"
                                                value={user?.email}
                                                readOnly
                                                className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-400 font-medium cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1.5 ml-1 italic">Contact support to change your account email.</p>
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone size={18} className="text-slate-300 group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="e.g. +256 700 000000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="btn-primary w-full h-14 rounded-xl flex items-center justify-center gap-2 text-lg font-bold shadow-lg shadow-primary/20"
                                    >
                                        {saving ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <>
                                                <Save size={20} /> SAVE CHANGES
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
