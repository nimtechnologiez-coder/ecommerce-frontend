"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";


export default function CartPage() {
    const { data: session, status } = useSession();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("CartPage Status:", status);
        if (status === "authenticated") {
            fetchCart();
        } else if (status === "unauthenticated") {
            window.location.href = `/login?callbackUrl=${encodeURIComponent("/cart")}`;
        }
    }, [status]);

    const fetchCart = async () => {
        try {
            setError(null);
            console.log("CartPage: Fetching cart...");
            const res = await fetch("/api/cart");
            console.log("CartPage: Res status:", res.status);
            
            if (res.ok) {
                const data = await res.json();
                console.log("CartPage: Items received:", data.items?.length || 0);
                setItems(data.items || []);
            } else if (res.status === 401) {
                console.log("CartPage: Unauthorized, redirecting...");
                window.location.href = `/login?callbackUrl=${encodeURIComponent("/cart")}`;
            } else {
                const data = await res.json().catch(() => ({ error: "Unknown error" }));
                setError(data.error || `Error ${res.status}`);
            }
        } catch (err) {
            console.error("Cart fetch failed:", err);
            setError("Connection failed. Please check your internet.");
        } finally {
            setLoading(false);
        }
    };

    const updateQty = async (productId, quantity) => {
        await fetch("/api/cart", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, quantity }) });
        fetchCart();
    };

    const removeItem = async (productId) => {
        await fetch("/api/cart", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
        fetchCart();
    };

    const subtotal = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
    const delivery = 5000;
    const total = subtotal + delivery;

    if (loading) return (
        <div className="bg-white">
            <Navbar />
            <div className="page-container flex items-center justify-center min-h-[60vh]">
                <div className="spinner w-8 h-8" />
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-white">
            <Navbar />
            <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="card p-8 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
                    <p className="text-sm text-secondary mb-6">{error}</p>
                    <button onClick={() => { setLoading(true); fetchCart(); }} className="btn-primary w-full">
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white">
            <Navbar />
            <div className="page-container">
                <h1 className="section-title">Your Cart</h1>
                <p className="section-sub">{items.length} item{items.length !== 1 ? "s" : ""}</p>

                {items.length === 0 ? (
                    <div className="card text-center py-20">
                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" style={{ color: "var(--text-muted)" }} />
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Your cart is empty</h3>
                        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Looks like you haven't added any products yet.</p>
                        <Link href="/products" className="btn-primary inline-flex">Browse Products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart items */}
                        <div className="lg:col-span-2 space-y-3">
                            {items.map((item) => (
                                <div key={item.productId} className="card flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                                        {item.image ? (
                                            item.image.startsWith("http") ? 
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" /> :
                                            <span>{item.image}</span>
                                        ) : (
                                            <span>📦</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm mb-1 line-clamp-2" style={{ color: "var(--text-primary)" }}>{item.name}</h3>
                                        <div className="font-bold text-slate-900">UGX {item.price.toLocaleString()}</div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-xl p-1 shrink-0" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                                        <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/20 transition" style={{ color: "var(--text-secondary)" }}>
                                            <Minus size={13} />
                                        </button>
                                        <span className="w-7 text-center text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.quantity}</span>
                                        <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/20 transition" style={{ color: "var(--text-secondary)" }}>
                                            <Plus size={13} />
                                        </button>
                                    </div>
                                    <div className="shrink-0 font-bold text-sm hidden sm:block" style={{ color: "var(--text-primary)" }}>
                                        UGX {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                    <button onClick={() => removeItem(item.productId)} className="shrink-0 p-2 rounded-lg transition-all hover:bg-red-900/20" style={{ color: "#EF4444" }}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="space-y-4">
                            <div className="card">
                                <h3 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                                        <span>Subtotal</span>
                                        <span>UGX {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                                        <span>Delivery Fee</span>
                                        <span>UGX {delivery.toLocaleString()}</span>
                                    </div>
                                    <div className="divider" />
                                    <div className="flex justify-between font-bold text-base" style={{ color: "var(--text-primary)" }}>
                                        <span>Total</span>
                                        <span className="text-slate-900">UGX {total.toLocaleString()}</span>
                                    </div>
                                </div>
                                <Link href="/checkout" className="btn-primary w-full mt-5 flex items-center justify-center gap-2">
                                    Proceed to Checkout <ArrowRight size={16} />
                                </Link>
                                <Link href="/products" className="btn-ghost w-full mt-2 text-center flex items-center justify-center gap-2 text-sm">
                                    <ShoppingBag size={14} /> Continue Shopping
                                </Link>
                            </div>

                            <div className="card-elevated p-4">
                                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>📱 Pay with Mobile Money at checkout</div>
                                <div className="flex items-center gap-2 text-xs mt-2" style={{ color: "var(--text-muted)" }}>🔒 Secure & encrypted payments</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
