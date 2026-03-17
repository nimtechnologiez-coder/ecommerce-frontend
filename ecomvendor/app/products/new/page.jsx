"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, Send } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const CATEGORIES = ["Engine Parts", "Body & Exterior", "Electrical", "Brakes", "Tires & Wheels", "Accessories", "Suspension", "Lubricants"];
const BRANDS = ["Toyota", "Honda", "Mitsubishi", "Nissan", "Subaru", "Universal", "Other"];

export default function AddProductPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", category: "", brand: "", compatibility: "", description: "", price: "", stock: "", images: [] });
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [error, setError] = useState("");
    const [kycStatus, setKycStatus] = useState("loading");

    useEffect(() => {
        fetch("/api/vendor/kyc", { cache: "no-store" })
            .then(async res => {
                if (!res.ok) {
                    if (res.status === 404) return setKycStatus("NOT_SUBMITTED");
                    throw new Error("Failed to load");
                }
                const data = await res.json();
                setKycStatus(data.kycStatus || "PENDING");
            })
            .catch(() => setKycStatus("ERROR"));
    }, []);

    const handleSubmit = async (e, isDraft = false) => {
        e.preventDefault();
        setError("");
        if (isDraft) setSavingDraft(true); else setLoading(true);
        try {
            const res = await fetch("/api/vendor/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: parseInt(form.price) || 0,
                    stock: parseInt(form.stock) || 0,
                    status: isDraft ? "DRAFT" : "PENDING",
                    images: form.images,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                router.push("/products");
            } else {
                setError(data.error || "Failed to save product. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setSavingDraft(false);
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6">
                <Link href="/products" className="text-sm text-slate-400 hover:text-slate-600">← Back to My Products</Link>
                <h1 className="text-2xl font-black text-slate-900 mt-2">Add New Product</h1>
                <p className="text-sm text-slate-500">Products require admin approval before going live on the marketplace.</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    ❌ {error}
                </div>
            )}

            {kycStatus === "loading" ? (
                <div className="text-center py-20 text-slate-400 text-sm animate-pulse">Checking seller eligibility...</div>
            ) : kycStatus === "NOT_SUBMITTED" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-10">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        🔒
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Verification Required</h2>
                    <p className="text-sm text-slate-600 mb-6">
                        You must complete your KYC verification and be approved by an administrator before you can list products on the marketplace.
                    </p>
                    <Link href="/kyc" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all">
                        Complete KYC Now
                    </Link>
                </div>
            ) : kycStatus === "PENDING" ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-10">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Save size={28} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Verification Under Review</h2>
                    <p className="text-sm text-slate-600 mb-6">
                        Your KYC documents are currently under review by our admin team. Once approved, you'll be able to access the Add Product form.
                    </p>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-xl text-sm font-bold shadow-sm border border-slate-200 hover:bg-slate-50 transition-all">
                        Return to Dashboard
                    </Link>
                </div>
            ) : kycStatus === "REJECTED" ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-10">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ⚠️
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Verification Failed</h2>
                    <p className="text-sm text-slate-600 mb-6">
                        Your KYC submission was rejected by the admin team. Please check the remarks and resubmit valid documents to list products.
                    </p>
                    <Link href="/kyc" className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">
                        Update Documents
                    </Link>
                </div>
            ) : (
            <form onSubmit={(e) => handleSubmit(e, false)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Product Details */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Basic Info */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                            <h2 className="font-bold text-slate-900">Basic Info</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Product Name *</label>
                                <input
                                    required type="text"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFFCF6] focus:border-[#BFFCF6] transition-all"
                                    placeholder="e.g. Toyota Camry Oil Filter OEM"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Category *</label>
                                    <select required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        <option value="">Select category</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Brand *</label>
                                    <select required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
                                        <option value="">Select brand</option>
                                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle Compatibility</label>
                                <input type="text"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFFCF6] transition-all"
                                    placeholder="e.g. Toyota Camry 2010-2022, Corolla 2012-2019"
                                    value={form.compatibility} onChange={e => setForm({ ...form, compatibility: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                <textarea rows={4}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none focus:ring-2 focus:ring-[#BFFCF6] transition-all"
                                    placeholder="Describe the product, its features, and specifications..."
                                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <h2 className="font-bold text-slate-900 mb-4">Pricing & Stock</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Price (UGX) *</label>
                                    <input required type="number" min="0"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFFCF6] transition-all"
                                        placeholder="e.g. 45000"
                                        value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Stock Quantity *</label>
                                    <input required type="number" min="0"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFFCF6] transition-all"
                                        placeholder="e.g. 50"
                                        value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Images + Actions */}
                    <div className="space-y-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <ImageUpload
                                value={form.images}
                                onChange={(urls) => setForm({ ...form, images: urls })}
                            />
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <h2 className="font-bold text-slate-900 mb-3">Submit Product</h2>
                            <div className="p-3 rounded-xl mb-4 text-xs bg-amber-50 border border-amber-200 text-amber-700">
                                ⏳ Products require admin approval before becoming live on the marketplace.
                            </div>
                            <div className="space-y-2">
                                <button
                                    type="submit" disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold hover:bg-[#A5F0E8] transition-colors disabled:opacity-60"
                                >
                                    {loading ? "Submitting..." : <><Send size={15} /> Submit for Approval</>}
                                </button>
                                <button
                                    type="button" onClick={(e) => handleSubmit(e, true)} disabled={savingDraft}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-60"
                                >
                                    {savingDraft ? "Saving..." : <><Save size={15} /> Save as Draft</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            )}
        </div>
    );
}
