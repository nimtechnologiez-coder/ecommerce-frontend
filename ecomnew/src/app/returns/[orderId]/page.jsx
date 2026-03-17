"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronLeft, RotateCcw, CheckCircle } from "lucide-react";

const REASONS = ["Wrong item received", "Defective / not working", "Item damaged on delivery", "Changed mind", "Not", "Other"];

export default function ReturnRequestPage({ params }) {
    const { orderId } = use(params);
    const router = useRouter();
    const [form, setForm] = useState({ reason: "", comment: "" });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/returns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: orderId, reason: form.reason, comment: form.comment }),
        });
        setLoading(false);
        if (res.ok) {
            setSubmitted(true);
        } else {
            const data = await res.json();
            alert(data.error || "Failed to submit return request");
        }
    };

    if (submitted) return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            <div className="page-container flex items-center justify-center min-h-[60vh]">
                <div className="card text-center max-w-md w-full animate-fade-in">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(0,179,65,0.1)", border: "2px solid rgba(0,179,65,0.3)" }}>
                        <CheckCircle size={32} style={{ color: "#00B341" }} />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Return Request Submitted</h2>
                    <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Your return request has been submitted. The vendor will review it within 2 business days.</p>
                    <Link href="/orders" className="btn-primary inline-flex">Back to Orders</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            <div className="page-container max-w-2xl">
                <Link href={`/orders/${orderId}`} className="flex items-center gap-2 text-sm mb-6 hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>
                    <ChevronLeft size={16} /> Back to Order
                </Link>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)" }}>
                        <RotateCcw size={20} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Request Return</h1>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Order #{orderId.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Reason for Return *</label>
                            <select required className="select-field" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}>
                                <option value="">Select a reason...</option>
                                {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Additional Comments</label>
                            <textarea rows={4} className="input-field resize-none" placeholder="Describe the issue in detail..." value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
                        </div>

                        <div className="p-4 rounded-xl text-sm" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                            📋 Returns are accepted within 7 days of delivery. Items must be in original condition.
                        </div>

                        <button type="submit" disabled={loading || !form.reason} className="btn-accent w-full flex items-center justify-center gap-2">
                            {loading ? <span className="spinner w-4 h-4" /> : <><RotateCcw size={16} /> Submit Return Request</>}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
