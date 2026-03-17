"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CreditCard, Smartphone, MapPin, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", momoPhone: "" });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(2); // Set to 2 as they are in the payment step
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "" });
    const [upiId, setUpiId] = useState("");

    useEffect(() => {
        if (status === "authenticated") {
            fetchCart();
        } else if (status === "unauthenticated") {
            window.location.href = `/login?callbackUrl=${encodeURIComponent("/checkout")}`;
        }
    }, [status, router]);

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                if (!data.items || data.items.length === 0) {
                    router.push("/cart");
                } else {
                    setCartItems(data.items);
                }
            } else if (res.status === 401) {
                window.location.href = `/login?callbackUrl=${encodeURIComponent("/checkout")}`;
            }
        } catch (err) {
            console.error("Checkout cart fetch failed:", err);
        } finally {
            setLoadingCart(false);
        }
    };

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const delivery = 5000;
    const total = subtotal + delivery;

    const handleOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        const randomRef = "PAY-" + Math.random().toString(36).substring(2, 9).toUpperCase();

        const orderRes = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                deliveryAddress: { name: form.name, phone: form.phone, address: form.address, city: form.city },
                paymentMethod: paymentMethod,
                paymentDetails: paymentMethod === "CARD" ? cardData : { upiId },
                paymentRef: randomRef
            }),
        });
        if (!orderRes.ok) { setLoading(false); return; }
        const order = await orderRes.json();

        // Simulate payment process or redirect to status
        setLoading(false);
        router.push(`/payment/status?orderId=${order._id}&method=${paymentMethod}&ref=${randomRef}`);
    };

    const methods = [
        { id: "UPI", label: "UPI", icon: "🇮🇳" },
        { id: "GPAY", label: "GPay / PhonePe", icon: "📱" },
        { id: "MBANK", label: "Mobile Banking", icon: "🏛️" },
        { id: "CARD", label: "Card Details", icon: "💳" }
    ];

    return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            <div className="page-container max-w-4xl">
                <h1 className="section-title">Checkout</h1>

                {/* Steps */}
                <div className="flex items-center gap-2 mb-8">
                    {["Delivery", "Payment", "Confirm"].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: step > i ? "var(--primary)" : step === i + 1 ? "var(--primary)" : "var(--bg-elevated)", color: step >= i + 1 ? "white" : "var(--text-muted)", border: "2px solid " + (step >= i + 1 ? "var(--primary)" : "var(--border)") }}>
                                    {step > i + 1 ? "✓" : i + 1}
                                </div>
                                <span className="text-sm font-medium hidden sm:block" style={{ color: step >= i + 1 ? "var(--text-primary)" : "var(--text-muted)" }}>{s}</span>
                            </div>
                            {i < 2 && <div className="flex-1 h-px" style={{ background: step > i + 1 ? "var(--primary)" : "var(--border)" }} />}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 space-y-4">
                            {/* Delivery address */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin size={18} style={{ color: "var(--primary-light)" }} />
                                    <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Delivery Address</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                                        <input required type="text" className="input-field" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Phone</label>
                                        <input required type="tel" className="input-field" placeholder="+256..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>City</label>
                                        <input required type="text" className="input-field" placeholder="Kampala" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Street Address</label>
                                        <input required type="text" className="input-field" placeholder="Street, Area" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard size={18} style={{ color: "var(--accent)" }} />
                                    <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    {methods.map(m => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setPaymentMethod(m.id)}
                                            className="p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1"
                                            style={{ 
                                                borderColor: paymentMethod === m.id ? "var(--primary)" : "var(--border)",
                                                background: paymentMethod === m.id ? "rgba(0,102,204,0.05)" : "transparent"
                                            }}
                                        >
                                            <span className="text-xl">{m.icon}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4 animate-fade-in" key={paymentMethod}>
                                    {(paymentMethod === "UPI" || paymentMethod === "GPAY") && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>UPI ID / Phone Number</label>
                                            <input required type="text" className="input-field" placeholder="username@upi or 0700000000" value={upiId} onChange={e => setUpiId(e.target.value)} />
                                            <p className="text-[10px] mt-2 text-slate-400">📲 You'll receive a request on your payment app.</p>
                                        </div>
                                    )}

                                    {paymentMethod === "CARD" && (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Card Number</label>
                                                <input required type="text" className="input-field" placeholder="0000 0000 0000 0000" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Expiry (MM/YY)</label>
                                                    <input required type="text" className="input-field" placeholder="12/28" value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>CVV</label>
                                                    <input required type="password" underline className="input-field" placeholder="***" value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "MBANK" && (
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                            <p className="text-sm font-medium mb-2">Select your Bank:</p>
                                            <select className="input-field mb-3">
                                                <option>Stanbic Bank</option>
                                                <option>Centenary Bank</option>
                                                <option>Absa Bank</option>
                                                <option>Standard Chartered</option>
                                            </select>
                                            <p className="text-[10px] text-slate-500 italic">You will be redirected to your bank's secure portal.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-2">
                            <div className="card sticky top-20">
                                <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Order Summary</h3>
                                <div className="space-y-2 text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>UGX {loadingCart ? "..." : subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span>UGX {delivery.toLocaleString()}</span>
                                    </div>
                                    <div className="divider" />
                                    <div className="flex justify-between font-bold text-base" style={{ color: "var(--text-primary)" }}>
                                        <span>Total</span>
                                        <span style={{ color: "var(--primary-light)" }}>UGX {loadingCart ? "..." : total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl mb-4 text-xs flex items-center gap-2" style={{ background: "rgba(0,179,65,0.06)", border: "1px solid rgba(0,179,65,0.2)", color: "#00B341" }}>
                                    🔒 Secured and Encrypted Transaction
                                </div>

                                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                                    {loading ? <span className="spinner w-5 h-5" /> : `🚀 Pay with ${paymentMethod}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
