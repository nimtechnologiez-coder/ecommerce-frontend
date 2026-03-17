"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/shared/StatusBadge";
import { useState } from "react";
import Link from "next/link";
import { Plus, MessageCircle, ArrowRight, DollarSign } from "lucide-react";

const DEMO_TRADES = [
    { _id: "T1", title: "Toyota Landcruiser 2018 Engine Block", description: "Complete engine block in excellent condition. Low mileage, full service history.", category: "Engine Parts", askingPrice: 3500000, status: "PENDING", seller: "John Ssali", offers: 3, emoji: "⚙️" },
    { _id: "T2", title: "Nissan Patrol Gearbox Complete", description: "5-speed manual gearbox, fully functional. Removed for upgrade.", category: "Drivetrain", askingPrice: 2100000, status: "PENDING", seller: "Peter Okello", offers: 0, emoji: "🔧" },
    { _id: "T3", title: "Honda Fit 2016 Engine 1.3L", description: "Engine sourced from Japan import, clean title. Tested and working.", category: "Engine Parts", askingPrice: 1800000, status: "COUNTERED", seller: "Grace Apio", offers: 2, emoji: "⚙️" },
    { _id: "T4", title: "Used Toyota Vitz Body Shell", description: "Complete body shell with doors. Minor dents, no rust.", category: "Body & Exterior", askingPrice: 950000, status: "PENDING", seller: "Robert Musoke", offers: 1, emoji: "🚗" },
];

export default function TradePage() {
    const [offerTradeId, setOfferTradeId] = useState(null);
    const [offerAmount, setOfferAmount] = useState("");
    const [offerNote, setOfferNote] = useState("");
    const [sent, setSent] = useState([]);

    const sendOffer = async (tradeId) => {
        const res = await fetch(`/api/trade/${tradeId}/offer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: parseInt(offerAmount), note: offerNote }),
        });
        if (res.ok) { setSent([...sent, tradeId]); setOfferTradeId(null); setOfferAmount(""); setOfferNote(""); }
        else if (res.status === 401) { window.location.href = "/login"; }
    };

    return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            <div className="page-container">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="section-title mb-0">Smart Trade (ADR)</h1>
                        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Negotiate the best deal. Make offers, counter-offers, and get a contract on acceptance.</p>
                    </div>
                    <Link href="/trade/new" className="btn-primary flex items-center gap-2">
                        <Plus size={16} /> Post a Listing
                    </Link>
                </div>

                {/* Info banner */}
                <div className="rounded-2xl p-5 mb-8 flex items-center gap-4" style={{ background: "rgba(0,102,204,0.08)", border: "1px solid rgba(0,102,204,0.2)" }}>
                    <div className="text-3xl">🤝</div>
                    <div>
                        <div className="font-semibold" style={{ color: "var(--text-primary)" }}>How Smart Trade Works</div>
                        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                            Sellers post auto parts/vehicles. Buyers send offers or counter-offers. Once accepted, a binding contract PDF is automatically generated.
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {DEMO_TRADES.map(trade => (
                        <div key={trade._id} className="card">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0" style={{ background: "var(--bg-elevated)" }}>
                                    {trade.emoji}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{trade.title}</h3>
                                        <StatusBadge status={trade.status} size="sm" />
                                    </div>
                                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{trade.category} · by {trade.seller}</p>
                                </div>
                            </div>
                            <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{trade.description}</p>

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Asking Price</div>
                                    <div className="text-lg font-black" style={{ color: "var(--accent)" }}>UGX {trade.askingPrice.toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>Offers Made</div>
                                    <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{trade.offers}</div>
                                </div>
                            </div>

                            {sent.includes(trade._id) ? (
                                <div className="text-center py-2 rounded-xl text-sm" style={{ background: "rgba(0,179,65,0.1)", color: "#00B341", border: "1px solid rgba(0,179,65,0.2)" }}>
                                    ✅ Offer sent Waiting for seller response.
                                </div>
                            ) : offerTradeId === trade._id ? (
                                <div className="space-y-2 animate-fade-in">
                                    <input type="number" className="input-field py-2 text-sm" placeholder="Your offer amount (UGX)" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} />
                                    <input type="text" className="input-field py-2 text-sm" placeholder="Message to seller (optional)" value={offerNote} onChange={e => setOfferNote(e.target.value)} />
                                    <div className="flex gap-2">
                                        <button onClick={() => sendOffer(trade._id)} className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-1">
                                            <ArrowRight size={14} /> Send Offer
                                        </button>
                                        <button onClick={() => setOfferTradeId(null)} className="btn-ghost py-2 px-4 text-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setOfferTradeId(trade._id)} className="btn-outline w-full flex items-center justify-center gap-2 text-sm">
                                    <MessageCircle size={14} /> Make an Offer
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}
