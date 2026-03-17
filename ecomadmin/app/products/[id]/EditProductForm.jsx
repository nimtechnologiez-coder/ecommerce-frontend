"use client";

import { useState } from "react";
import { updateProduct } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, X, Package } from "lucide-react";

export default function EditProductForm({ product, vendors, onCancel }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.target);
        const result = await updateProduct(product._id, formData);

        setLoading(false);
        if (result.success) {
            setMessage({ type: "success", text: "Product updated successfully!" });
            setTimeout(() => {
                router.push(onCancel);
                router.refresh();
            }, 1000);
        } else {
            setMessage({ type: "error", text: result.error });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Package size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Edit Product Details</h2>
                        <p className="text-[13px] text-slate-500">Administrative override of vendor product data.</p>
                    </div>
                </div>
                <Link 
                    href={onCancel}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                    <X size={20} />
                </Link>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-sm font-bold ${
                    message.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Product Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        defaultValue={product.name} 
                        required 
                        className="input-field" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Brand</label>
                    <input 
                        type="text" 
                        name="brand" 
                        defaultValue={product.brand} 
                        className="input-field" 
                    />
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                    <textarea 
                        name="description" 
                        defaultValue={product.description} 
                        rows={4} 
                        className="input-field resize-none" 
                    />
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Compatibility</label>
                    <input 
                        type="text" 
                        name="compatibility" 
                        defaultValue={product.compatibility} 
                        className="input-field" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Price (UGX)</label>
                    <input 
                        type="number" 
                        name="price" 
                        defaultValue={product.price} 
                        required 
                        min="0" 
                        className="input-field font-mono" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Stock Level</label>
                    <input 
                        type="number" 
                        name="stock" 
                        defaultValue={product.stock} 
                        required 
                        min="0" 
                        className="input-field font-mono" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                    <select name="category" defaultValue={product.category} required className="input-field">
                        <option value="Engine Parts">Engine Parts</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Fluids & Lubricants">Fluids & Lubricants</option>
                        <option value="Brakes">Brakes</option>
                        <option value="Suspension">Suspension</option>
                        <option value="Filters">Filters</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assign Vendor</label>
                    <select name="vendorId" defaultValue={product.vendorId?._id || ""} required className="input-field">
                        {vendors.map(v => (
                            <option key={v._id} value={v._id}>{v.businessName}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Override Status</label>
                    <select name="status" defaultValue={product.status} required className="input-field font-bold">
                        <option value="PENDING">PENDING (In Review)</option>
                        <option value="LIVE">LIVE (Public)</option>
                        <option value="REJECTED">REJECTED (Private)</option>
                        <option value="DRAFT">DRAFT</option>
                    </select>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
                <Link 
                    href={onCancel}
                    className="flex-1 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-center"
                >
                    Cancel
                </Link>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? "Saving Changes..." : "Save Product Details"}
                </button>
            </div>
        </form>
    );
}
