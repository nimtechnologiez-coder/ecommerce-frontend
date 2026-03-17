"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Image as ImageIcon, Camera } from "lucide-react";
import Link from "next/link";

export default function PostNewTradePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "Engine Parts",
        askingPrice: "",
        description: "",
        images: [""]
    });

    const categories = ["Engine Parts", "Body & Exterior", "Electrical", "Brakes", "Tires & Wheels", "Accessories", "Suspension", "Drivetrain", "Lubricants"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    askingPrice: parseInt(formData.askingPrice)
                }),
            });
            if (res.ok) {
                router.push("/trade");
            } else {
                alert("Failed to post listing. Please try again.");
            }
        } catch (err) {
            console.error("Error posting trade:", err);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link href="/trade" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-bold">
                <ArrowLeft size={16} /> Back to Management
            </Link>

            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Post ADR Listing</h1>
                    <p className="text-sm text-slate-500 mt-1">Sellers post high-value items for negotiation and contract generation.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Listing Title</label>
                            <input 
                                required
                                type="text"
                                placeholder="e.g. Toyota V8 Engine Block 2022"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BFFCF6] focus:border-slate-300 outline-none transition-all text-sm font-medium"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                            <select 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BFFCF6] focus:border-slate-300 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Asking Price (UGX)</label>
                            <input 
                                required
                                type="number"
                                placeholder="e.g. 4500000"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BFFCF6] focus:border-slate-300 outline-none transition-all text-sm font-black"
                                value={formData.askingPrice}
                                onChange={e => setFormData({...formData, askingPrice: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Technical Description</label>
                        <textarea 
                            rows={4}
                            placeholder="Detail the condition, history, and technical specs of the item..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BFFCF6] focus:border-slate-300 outline-none transition-all text-sm leading-relaxed font-medium"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Product Images (URLs)</label>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                                    <ImageIcon size={20} className="text-slate-300" />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="Paste image URL here..."
                                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BFFCF6] focus:border-slate-300 outline-none transition-all text-xs font-medium"
                                    value={formData.images[0]}
                                    onChange={e => {
                                        const imgs = [...formData.images];
                                        imgs[0] = e.target.value;
                                        setFormData({...formData, images: imgs});
                                    }}
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 italic px-1">Note: Professional photos increase offer rates by up to 45%.</p>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] transition-all ${loading ? 'opacity-50' : 'hover:bg-slate-800 hover:shadow-xl'}`}
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={18} /> Publish ADR Listing</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
