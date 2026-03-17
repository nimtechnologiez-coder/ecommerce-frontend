"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WishlistButton from "@/components/shared/WishlistButton";
import { ShoppingCart, Trash2, Heart, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/wishlist");
        } else if (status === "authenticated") {
            fetchWishlist();
        }
    }, [status]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch("/api/user/wishlist");
            const data = await res.json();
            
            if (res.ok) {
                setWishlist(data);
            } else {
                setError(data.details || data.error || "Failed to load wishlist. Please try again.");
            }
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
            setError("A connection error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, e) => {
        e.preventDefault();
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: 1 }),
        });
        if (res.ok) alert("Added to cart");
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
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 mb-2">My <span className="gradient-text italic">Wishlist</span></h1>
                            <p className="text-slate-500">Products you've saved for later.</p>
                        </div>
                        <Link href="/products" className="btn-ghost flex items-center gap-2 text-sm">
                            CONTINUE SHOPPING <ArrowRight size={16} />
                        </Link>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 mb-8">
                            <Heart size={20} />
                            <p className="text-sm font-medium">{error}</p>
                            <button onClick={fetchWishlist} className="ml-auto underline text-xs font-bold uppercase">Retry</button>
                        </div>
                    )}

                    {wishlist.length === 0 ? (
                        <div className="card text-center py-20 border-none shadow-xl shadow-slate-200/50">
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                <Heart size={40} className="text-slate-200" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">See something you like? Tap the heart icon to save it here for later.</p>
                            <Link href="/products" className="btn-primary px-8 h-12 inline-flex">
                                EXPLORE PRODUCTS
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlist.map((product) => (
                                <div key={product._id} className="product-card group bg-white shadow-xl shadow-slate-200/50 p-5 relative">
                                    <div className="absolute top-4 right-4 z-10 transition-transform group-hover:scale-110">
                                        <WishlistButton 
                                            productId={product._id} 
                                            initialIsWished={true} 
                                            onToggle={(isWished) => {
                                                if (!isWished) {
                                                    setWishlist(prev => prev.filter(p => p._id !== product._id));
                                                }
                                            }}
                                        />
                                    </div>

                                    <div 
                                        onClick={() => router.push(`/products/${product._id}`)}
                                        className="cursor-pointer"
                                    >
                                        <div className="h-48 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 overflow-hidden relative">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <span className="text-6xl">{product.emoji || "⚙️"}</span>
                                            )}
                                        </div>
                                        
                                        <div className="px-2">
                                            <div className="text-[10px] font-black tracking-widest text-primary-dark mb-1 uppercase">{product.category}</div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-1 group-hover:text-primary-dark transition-colors">{product.name}</h3>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Price</div>
                                                    <div className="text-xl font-black text-slate-900">UGX {Number(product.price).toLocaleString()}</div>
                                                </div>
                                                <button 
                                                    onClick={(e) => addToCart(product._id, e)}
                                                    className="w-10 h-10 rounded-xl bg-primary text-slate-900 flex items-center justify-center hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                                                    title="Add to Cart"
                                                >
                                                    <ShoppingCart size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
