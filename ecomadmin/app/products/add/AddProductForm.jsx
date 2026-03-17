"use client";

import { useState } from "react";
import { addProduct } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2, PackagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProductForm({ vendors }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.target);
        
        const result = await addProduct(formData);

        if (result.success) {
            router.push("/products");
            router.refresh();
        } else {
            setMessage({ type: "error", text: result.error });
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PackagePlus className="text-primary" /> Enter Product Details
            </h2>

            {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${
                    message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Product Name *</label>
                        <input type="text" name="name" required className="input-field" placeholder="e.g. Engine Oil 5W-30" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Brand *</label>
                        <input type="text" name="brand" required className="input-field" placeholder="e.g. Castrol" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                    <textarea name="description" rows={4} className="input-field resize-none" placeholder="Detailed product description..."></textarea>
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Compatibility</label>
                    <input type="text" name="compatibility" className="input-field" placeholder="e.g. Universal, Toyota Corolla 2018+" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Price (UGX) *</label>
                        <input type="number" name="price" required min="0" step="100" className="input-field" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Initial Stock</label>
                        <input type="number" name="stock" min="0" defaultValue="0" className="input-field" placeholder="0" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
                        <select name="category" required className="input-field">
                            <option value="">Select Category...</option>
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
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Vendor *</label>
                        <select name="vendorId" required className="input-field">
                            <option value="">Assign to Vendor...</option>
                            {vendors.map(vendor => (
                                <option key={vendor._id} value={vendor._id}>
                                    {vendor.businessName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-3">
                    <Link href="/products" className="btn-outline flex-1 text-center justify-center">
                        Cancel
                    </Link>
                    <button type="submit" disabled={loading} className="bg-primary text-slate-900 px-6 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all flex-[2] disabled:opacity-50">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
