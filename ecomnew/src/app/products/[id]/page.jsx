"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Shield, Truck, Store, ChevronLeft, Star, Plus, Minus, Heart } from "lucide-react";
import WishlistButton from "@/components/shared/WishlistButton";

const DEMO = {
    _id: "1", name: "Toyota Camry Genuine Oil Filter", price: 45000, category: "Engine Parts", brand: "Toyota",
    compatibility: "Toyota Camry 2010–2022, Toyota Corolla 2012–2020", description: "High-quality genuine OEM Toyota oil filter. Ensures maximum engine protection by removing harmful particles from engine oil. Easy installation, long service life.",
    stock: 23, emoji: "⚙️", vendor: "AutoParts UG", rating: 4.8, reviews: 42, deliveryDays: "2-4 days",
    images: ["⚙️", "🔧", "📦"],
};
export default function ProductDetailPage({ params: paramsPromise }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(0);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasAutoBought = useRef(false);

    useEffect(() => {
        const fetchProduct = async () => {
            const params = await paramsPromise;
            try {
                const res = await fetch(`/api/products/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [paramsPromise]);

    useEffect(() => {
        if (product && searchParams.get("buyNow") === "true" && !hasAutoBought.current) {
            hasAutoBought.current = true;
            const timer = setTimeout(() => {
                buyNow();
            }, 1000); // 1s delay to see details
            return () => clearTimeout(timer);
        }
    }, [product, searchParams]);

    const addToCart = async () => {
        if (!product) return;
        setAdding(true);
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id, quantity: qty }),
        });
        setAdding(false);
        if (res.ok) { 
            setAdded(true); 
            setTimeout(() => setAdded(false), 2500); 
        } else if (res.status === 401) {
            window.location.href = `/login?callbackUrl=${encodeURIComponent(`/products/${product._id}`)}`;
        } else {
            const data = await res.json();
            alert(data.error || "Failed to add to cart");
        }
    };

    const buyNow = async () => {
        if (!product) return;
        setAdding(true);
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product._id, quantity: qty }),
        });
        setAdding(false);
        if (res.ok) { 
            router.push("/checkout");
        } else if (res.status === 401) {
            router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`);
        } else {
            const data = await res.json();
            alert(data.error || "Failed to process Buy Now");
        }
    };

    if (loading) {
        return (
            <div className="bg-white">
                <Navbar />
                <div className="page-container flex items-center justify-center min-h-[60vh]">
                    <div className="spinner w-8 h-8" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-white">
                <Navbar />
                <div className="page-container text-center py-20">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Product not found</h1>
                    <Link href="/products" className="btn-primary inline-flex">Back to Products</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-white">
            <Navbar />
            <div className="page-container">
                <Link href="/products" className="flex items-center gap-2 text-sm mb-6 transition-colors hover:text-primary-dark" style={{ color: "var(--text-muted)" }}>
                    <ChevronLeft size={16} /> Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Images */}
                    <div>
                        <div className="aspect-square rounded-2xl flex items-center justify-center mb-4 text-8xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                            {product.images && product.images.length > 0 ? (
                                product.images[activeImg].startsWith("http") ? 
                                <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-contain p-8" /> :
                                <span>{product.images[activeImg]}</span>
                            ) : (
                                <span>📦</span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {product.images && product.images.length > 0 && product.images.map((img, i) => (
                                <button key={i} onClick={() => setActiveImg(i)} className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl transition-all overflow-hidden"
                                    style={{ background: "var(--bg-elevated)", border: `2px solid ${activeImg === i ? "var(--primary)" : "var(--border)"}` }}>
                                    {img.startsWith("http") ? <img src={img} className="w-full h-full object-cover" /> : img}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{product.category} • {product.brand}</div>
                        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>{product.name}</h1>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(product.rating || 4.5) ? "#F59E0B" : "none"} color="#F59E0B" />)}
                            </div>
                            <span className="font-semibold text-sm" style={{ color: "#F59E0B" }}>{product.rating || 4.5}</span>
                            <span className="text-sm" style={{ color: "var(--text-muted)" }}>({product.reviews || 0} reviews)</span>
                        </div>

                        <div className="text-3xl font-black mb-6 text-slate-900">
                            UGX {product.price.toLocaleString()}
                        </div>

                        {/* Compatibility */}
                        <div className="card-elevated p-4 mb-4">
                            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>🚗 Vehicle Compatibility</div>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{product.compatibility}</p>
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className={`badge ${product.stock > 0 ? "badge-approved" : "badge-rejected"}`}>
                                {product.stock > 0 ? `● In Stock (${product.stock} units)` : "● Out of Stock"}
                            </span>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Quantity:</label>
                            <div className="flex items-center gap-3 rounded-xl p-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-primary/20" style={{ color: "var(--text-secondary)" }}>
                                    <Minus size={14} />
                                </button>
                                <span className="w-8 text-center font-semibold" style={{ color: "var(--text-primary)" }}>{qty}</span>
                                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-primary/20" style={{ color: "var(--text-secondary)" }}>
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <button onClick={addToCart} disabled={adding || product.stock === 0} className="btn-outline flex-1 flex items-center justify-center gap-2 py-4">
                                {adding ? <span className="spinner w-5 h-5" /> : added ? <><span>✅</span> Added</> : <><ShoppingCart size={18} /> Add to Cart</>}
                            </button>
                            <button onClick={buyNow} disabled={adding || product.stock === 0} className="btn-primary flex-1 py-4">
                                BUY NOW
                            </button>
                            <div className="flex items-center justify-center">
                                <WishlistButton productId={product._id} />
                            </div>
                        </div>

                        {/* Vendor + delivery info */}
                        <Link href={`/vendor/${product.vendorId?._id}`} className="grid grid-cols-2 gap-3 group/vendor">
                            <div className="card-elevated p-3 flex items-center gap-2 group-hover/vendor:border-primary transition-colors">
                                <Store size={16} className="text-primary-dark" />
                                <div>
                                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Sold by</div>
                                    <div className="text-sm font-semibold group-hover/vendor:text-primary-dark transition-colors" style={{ color: "var(--text-primary)" }}>{product.vendorId?.businessName || "AutoParts UG"}</div>
                                </div>
                            </div>
                            <div className="card-elevated p-3 flex items-center gap-2">
                                <Truck size={16} style={{ color: "#00B341" }} />
                                <div>
                                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Delivery</div>
                                    <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{product.deliveryDays || "2-4 days"}</div>
                                </div>
                            </div>
                        </Link>

                        {/* Description */}
                        <div className="mt-6">
                            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Description</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{product.description}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-6 p-3 rounded-xl text-xs" style={{ background: "rgba(0,179,65,0.05)", border: "1px solid rgba(0,179,65,0.15)" }}>
                            <Shield size={14} style={{ color: "#00B341" }} />
                            <span style={{ color: "#00B341" }}>Secure payment. 7-day return policy.</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
