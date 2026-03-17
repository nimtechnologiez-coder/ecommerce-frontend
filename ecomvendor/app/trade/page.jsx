"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MessageSquare, ArrowRight, Gavel, Filter, Search, ShieldCheck, Zap, Handshake, Target, FileText, Sparkles, HelpCircle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { useSession } from "next-auth/react";

export default function TradeManagementPage() {
    const { data: session } = useSession();
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const res = await fetch("/api/trade");
                if (res.ok) {
                    const data = await res.json();
                    setTrades(data);
                }
            } catch (err) {
                console.error("Failed to fetch trades:", err);
            } finally {
                setLoading(false);
            }
        };
        if (session) fetchTrades();
    }, [session]);

    const filteredTrades = filter === "ALL" ? trades : trades.filter(t => t.status === filter);

    return (
        <div className="p-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Smart Trade Portal</h1>
                    <p className="text-sm text-slate-500 mt-1">Advanced Digital Rights & Negotiation Management.</p>
                </div>
                <Link href="/trade/new" className="flex items-center gap-2 px-6 py-3 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold hover:shadow-lg transition-all border border-slate-200">
                    <Plus size={18} /> Post ADR Listing
                </Link>
            </div>

            {/* About Smart Trade Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="lg:col-span-2 bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden group">
                    <Sparkles className="absolute -top-6 -right-6 text-white/5 w-48 h-48 group-hover:rotate-12 transition-transform duration-700" />
                    <div className="relative z-10 max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="text-[#BFFCF6]" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure ADR System</span>
                        </div>
                        <h2 className="text-2xl font-black mb-4">What is Smart Trade?</h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Smart Trade is PHAMON's exclusive Alternative Dispute Resolution (ADR) system. It enables secure, high-value negotiations for rare parts, bulk orders, and specialized automotive services using automated smart contracts.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <Zap size={14} className="text-[#BFFCF6]" /> Instant Payouts
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <Handshake size={14} className="text-[#BFFCF6]" /> Legal Contracts
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <Target size={14} className="text-[#BFFCF6]" /> Verified Escrow
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <HelpCircle size={14} /> Quick Tips
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-[10px] font-black">1</div>
                            <p className="text-xs text-slate-600 font-medium">Be flexible with counter-offers to close deals faster.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-[10px] font-black">2</div>
                            <p className="text-xs text-slate-600 font-medium">Use high-quality images to justify your asking price.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-[10px] font-black">3</div>
                            <p className="text-xs text-slate-600 font-medium">Respond to offers within 4 hours for 3x higher success rank.</p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* How it Works section */}
            <div className="mb-12">
                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                    How it Works <ArrowRight size={18} className="text-blue-500" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "List Item", desc: "Post your high-value item or service as an ADR listing.", icon: Plus, bg: "bg-blue-50", color: "text-blue-600" },
                        { title: "Receive Offers", desc: "Buyers submit monetary offers for your review.", icon: MessageSquare, bg: "bg-amber-50", color: "text-amber-600" },
                        { title: "Negotiate", desc: "Accept, reject, or send a counter-offer instantly.", icon: Gavel, bg: "bg-indigo-50", color: "text-indigo-600" },
                        { title: "Contract", desc: "Digital smart contract is generated automatically.", icon: FileText, bg: "bg-green-50", color: "text-green-600" },
                    ].map((step, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 relative">
                            <div className={`w-12 h-12 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-4`}>
                                <step.icon size={24} />
                            </div>
                            <h4 className="font-black text-slate-900 mb-2">{step.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                            {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-200"><ArrowRight size={20} /></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {["ALL", "PENDING", "COUNTERED", "ACCEPTED", "CANCELLED"].map(s => (
                        <button 
                            key={s} 
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                filter === s 
                                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20" 
                                : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    Showing {filteredTrades.length} Active Negotiations
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#BFFCF6] border-t-slate-900 rounded-full animate-spin" />
                </div>
            ) : filteredTrades.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Gavel size={32} className="text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No Trade Listings Found</h2>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">You haven't posted any items for Smart Trade yet. Start your first negotiation today to tap into high-value markets.</p>
                    <Link href="/trade/new" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
                        Post Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredTrades.map((trade) => (
                        <div key={trade._id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all group">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-105 transition-transform overflow-hidden border border-slate-100 shadow-sm">
                                            {trade.images?.[0] ? <img src={trade.images[0]} className="w-full h-full object-cover" /> : "⚙️"}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black tracking-widest text-blue-600 uppercase mb-1">{trade.category}</div>
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{trade.title}</h3>
                                        </div>
                                    </div>
                                    <StatusBadge status={trade.status} />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Asking Price</div>
                                        <div className="text-xl font-black text-slate-900 font-mono tracking-tighter">UGX {trade.askingPrice.toLocaleString()}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-center">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Offer History</div>
                                        <div className="text-xl font-black text-slate-900 font-mono tracking-tighter">{trade.offerHistory?.length || 0} Offers</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-3xl text-sm font-black tracking-tight hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95">
                                        <MessageSquare size={18} /> MANAGE OFFERS
                                    </button>
                                    <button className="px-5 py-4 border border-slate-200 rounded-3xl text-slate-500 hover:bg-slate-50 transition-colors active:scale-95">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            {trade.status === "ACCEPTED" && (
                                <div className="px-8 py-4 bg-green-50 border-t border-green-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-green-700 flex items-center gap-2 uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        SMART CONTRACT ACTIVE
                                    </span>
                                    <button className="text-[10px] font-black text-green-700 hover:underline tracking-widest uppercase bg-white px-3 py-1.5 rounded-lg border border-green-200">VIEW PDF</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
