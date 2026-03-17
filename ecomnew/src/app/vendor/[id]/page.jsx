"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useParams, useRouter } from "next/navigation";
import { Store, MapPin, Package, Star, ShoppingCart, ArrowRight, AlertTriangle } from "lucide-react";
import WishlistButton from "@/components/shared/WishlistButton";

export default function VendorStorefront() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const res = await fetch(`/api/vendors/${id}`);
                if (res.ok) {
                    const d = await res.json();
                    setData(d);
                }
            } catch (err) {
                console.error("Failed to fetch vendor storefront:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendorData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="spinner w-12 h-12" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="text-6xl mb-4">🏪</div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Vendor Not Found</h1>
                    <p className="text-slate-500 mb-6">This dealership or vendor doesn't seem to exist or has been removed.</p>
                    <button onClick={() => router.push("/products")} className="btn-primary px-8">Browse All Products</button>
                </div>
                <Footer />
            </div>
        );
    }

    const { vendor, products } = data;

    return (
        <div className="bg-[#F8FAFC] min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1">
                {/* Store Header/Banner */}
                <div className="relative h-64 lg:h-80 w-full overflow-hidden bg-slate-900">
                    {vendor.storeBanner ? (
                        <img src={vendor.storeBanner} alt={vendor.businessName} className="w-full h-full object-cover opacity-60" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 opacity-80" />
                    )}
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/20">
                         {/* Store Logo Circle */}
                         <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-white border-4 border-white shadow-2xl overflow-hidden mb-4 animate-in zoom-in duration-500">
                            {vendor.storeLogo ? (
                                <img src={vendor.storeLogo} alt={vendor.businessName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center text-3xl font-black text-slate-900 uppercase">
                                    {vendor.businessName.charAt(0)}
                                </div>
                            )}
                         </div>
                         <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                            {vendor.businessName}
                         </h1>
                         <div className="flex items-center gap-4 mt-2 text-white/90">
                            <span className="flex items-center gap-1 text-sm font-bold bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                                <Package size={14} className="text-primary" />
                                {products.length} Products
                            </span>
                         </div>
                    </div>
                </div>

                {/* Announcement Banner */}
                {vendor.storeAnnouncement && (
                    <div className="bg-primary/10 border-b border-primary/20 animate-in slide-in-from-top-4 duration-700">
                        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                                <AlertTriangle size={16} />
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">
                                {vendor.storeAnnouncement}
                            </p>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card p-6 space-y-6">
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">About Dealer</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        {vendor.description || `Welcome to ${vendor.businessName}. We are authorized dealers providing high-quality automotive parts and services to our customers.`}
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification</div>
                                            <div className="text-xs font-bold text-slate-700">Verified Dealership</div>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="lg:col-span-3">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    Recent Inventory
                                </h2>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Showing {products.length} items
                                </div>
                            </div>

                            {products.length === 0 ? (
                                <div className="card text-center py-20 flex flex-col items-center">
                                    <Package size={48} className="text-slate-200 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900">No active listings</h3>
                                    <p className="text-slate-500 text-sm">This vendor hasn't posted any products for sale yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <div 
                                            key={product._id} 
                                            onClick={() => router.push(`/products/${product._id}`)} 
                                            className="product-card group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] border border-slate-100"
                                        >
                                            <div className="h-48 rounded-t-[2rem] relative bg-slate-50 overflow-hidden">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">📦</div>
                                                )}
                                                <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                    <WishlistButton productId={product._id} />
                                                </div>
                                            </div>
                                            
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-md">
                                                        {product.category}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-900 mb-4 line-clamp-1 group-hover:text-primary-dark transition-colors">{product.name}</h3>
                                                
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div>
                                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</div>
                                                        <div className="text-lg font-black text-slate-900">UGX {Number(product.price).toLocaleString()}</div>
                                                    </div>
                                                    <button className="w-10 h-10 rounded-xl bg-primary text-slate-900 flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-90 transition-all">
                                                        <ShoppingCart size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Simple shield check icon placeholder
function ShieldCheck({ size = 24, className = "" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
