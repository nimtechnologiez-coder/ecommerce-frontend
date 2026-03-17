"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus, Package, RefreshCw } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export default function VendorProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [kycStatus, setKycStatus] = useState("loading");
    const { data: session } = useSession();

    const fetchProducts = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            // Check KYC first
            const kycRes = await fetch("/api/vendor/kyc", { cache: "no-store" });
            if (kycRes.ok) {
                const kycData = await kycRes.json();
                setKycStatus(kycData.kycStatus || "PENDING");
            } else if (kycRes.status === 404) {
                setKycStatus("NOT_SUBMITTED");
            } else {
                setKycStatus("ERROR");
            }

            // cache: 'no-store' ensures we always get fresh data from DB, not cached
            const res = await fetch("/api/vendor/products", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setKycStatus("ERROR");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (session) {
            fetchProducts();
            // Auto-refresh every 30 seconds to pick up admin approvals
            const interval = setInterval(() => fetchProducts(true), 30000);
            return () => clearInterval(interval);
        }
    }, [session, fetchProducts]);

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">My Products</h1>
                    <p className="text-sm text-slate-500 mt-1">{products.length} products in your store</p>
                </div>
                {kycStatus === "APPROVED" && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchProducts(true)}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-60"
                            title="Refresh product status"
                        >
                            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
                            {refreshing ? "Refreshing..." : "Refresh"}
                        </button>
                        <Link href="/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold hover:bg-[#A5F0E8] transition-colors">
                            <Plus size={16} /> Add Product
                        </Link>
                    </div>
                )}
            </div>

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
                        <Package size={28} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Almost There!</h2>
                    <p className="text-sm text-slate-600 mb-6">
                        Your KYC documents are currently under review. Once an admin approves your profile, you'll be able to add and manage your products here.
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
            ) : loading ? (
                <div className="text-center py-20 text-slate-400 text-sm">Loading your products...</div>
            ) : products.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl text-center py-20">
                    <Package size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="font-semibold text-slate-900">No products yet</h3>
                    <p className="text-sm mt-1 mb-4 text-slate-400">Add your first product to start selling.</p>
                    <Link href="/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold">
                        <Plus size={16} /> Add First Product
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                                                ) : "⚙️"}
                                            </div>
                                            <span className="font-medium text-slate-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{product.category}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">UGX {product.price?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${product.stock === 0 ? "text-red-500" : product.stock < 5 ? "text-amber-500" : "text-slate-700"}`}>
                                            {product.stock === 0 ? "Out of Stock" : product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={product.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
