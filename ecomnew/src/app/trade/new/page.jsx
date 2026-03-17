"use client";
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { Send, Image as ImageIcon, Plus, X } from "lucide-react";

export default function TradeNewPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        category: "",
        askingPrice: "",
        description: "",
        images: []
    });
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const CATEGORIES = ["Engine Parts", "Body & Exterior", "Electrical", "Brakes", "Tires & Wheels", "Accessories", "Suspension", "Lubricants", "Other"];

    const addImage = () => {
        if (!imageUrl) return;
        setForm({ ...form, images: [...form.images, imageUrl] });
        setImageUrl("");
    };

    const removeImage = (index) => {
        const newImages = [...form.images];
        newImages.splice(index, 1);
        setForm({ ...form, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    askingPrice: parseInt(form.askingPrice)
                }),
            });

            if (res.ok) {
                router.push("/trade");
            } else {
                const data = await res.json();
                setError(data.error || "Failed to post listing");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "var(--bg-dark)", minHeight: "100vh" }}>
            <Navbar />
            <div className="page-container py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="section-title">Post a Trade Listing</h1>
                    <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
                        List your auto parts or vehicle for negotiation on the ADR platform.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="card">
                            <h2 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Listing Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Title *</label>
                                    <input 
                                        required 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="e.g. Toyota Camry 2018 Engine Block" 
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Category *</label>
                                        <select 
                                            required 
                                            className="input-field py-2"
                                            value={form.category}
                                            onChange={e => setForm({ ...form, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Asking Price (UGX) *</label>
                                        <input 
                                            required 
                                            type="number" 
                                            className="input-field" 
                                            placeholder="e.g. 3500000" 
                                            value={form.askingPrice}
                                            onChange={e => setForm({ ...form, askingPrice: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Description</label>
                                    <textarea 
                                        rows={4} 
                                        className="input-field resize-none" 
                                        placeholder="Provide as much detail as possible about the item..."
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Images</h2>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="input-field flex-1" 
                                        placeholder="Paste image URL here..." 
                                        value={imageUrl}
                                        onChange={e => setImageUrl(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addImage}
                                        className="btn-outline px-4 flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add
                                    </button>
                                </div>

                                {form.images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {form.images.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="p-4 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center py-8 text-slate-400">
                                    <ImageIcon size={32} className="mb-2 opacity-20" />
                                    <p className="text-xs">Paste images URLs from your browser/Cloudinary</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg"
                        >
                            {loading ? "Posting..." : <><Send size={20} /> Post Listing</>}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
