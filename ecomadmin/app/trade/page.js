"use client";
import { useState, useEffect } from "react";
import { ArrowLeftRight, Search, Gavel, ShieldCheck, FileText, User, ArrowRight, TrendingUp, Zap, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const mockTrades = [
    { id: "T_101", title: "Honda Civic Engine Block", seller: "Auto Parts Pro", buyer: "John Doe", lastOffer: 2500000, status: "COUNTERED", date: "2024-03-15" },
    { id: "T_102", title: "Toyota Original Radiator", seller: "Cooling Systems", buyer: "Jane Smith", lastOffer: 450000, status: "ACCEPTED", date: "2024-03-14" },
    { id: "T_103", title: "Mercedes LED Headlights", seller: "Luxury Spares", buyer: "Mike Ross", lastOffer: 1800000, status: "PENDING", date: "2024-03-13" },
    { id: "T_104", title: "Bulk Spark Plugs (100pcs)", seller: "Global Parts", buyer: "Service Center B", lastOffer: 350000, status: "CANCELLED", date: "2024-03-12" },
];

export default function TradePage() {
    const [trades, setTrades] = useState(mockTrades);
    const [filter, setFilter] = useState("ALL");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const stats = [
        { label: "Active Negotiations", value: "24", icon: Gavel, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Total Contract Value", value: "UGX 45.2M", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Completed Agreements", value: "156", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
    ];

    const handleViewLedger = (id) => {
        alert(`Opening Chat Ledger for Negotiation ${id}... (Session Audit Mode)`);
    };

    const handleAudit = (id) => {
        alert(`Auditing Smart Contract for Trade ${id}... Verification in progress.`);
    };

    const filteredTrades = filter === "ALL" ? trades : trades.filter(t => t.status === filter);

    return (
        <div className="p-8 pb-32">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Smart Trade Portal</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor and supervise High-Value ADR Negotiations & Smart Contracts.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#BFFCF6]/20 px-4 py-2 rounded-2xl border border-[#BFFCF6]">
                    <Sparkles className="text-blue-600" size={18} />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Administrator Supervision</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-5 hover:shadow-lg transition-all duration-300">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
                            <div className="text-2xl font-black text-slate-900 leading-none">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <h3 className="font-black text-slate-900 uppercase tracking-tight">Negotiation Ledger</h3>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                            {["ALL", "PENDING", "COUNTERED", "ACCEPTED", "CANCELLED"].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setFilter(s)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border transition-all whitespace-nowrap ${
                                        filter === s 
                                        ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by item or user..." 
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-64 bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Negotiation Item</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participants</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Valuation</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-medium">
                            {filteredTrades.map((trade) => (
                                <tr key={trade.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-[#BFFCF6] group-hover:text-slate-900 transition-colors">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900">{trade.title}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Started {trade.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                                            <FileText size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">ADR-V1</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-slate-300 uppercase w-10">Seller</span>
                                                <span className="text-xs font-bold text-slate-700">{trade.seller}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-slate-300 uppercase w-10">Buyer</span>
                                                <span className="text-xs font-bold text-slate-700">{trade.buyer}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900 font-mono tracking-tighter">
                                        UGX {mounted ? trade.lastOffer.toLocaleString('en-US') : trade.lastOffer}
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={trade.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleViewLedger(trade.id)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                                title="View Chat Ledger"
                                            >
                                                <MessageSquare size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleAudit(trade.id)}
                                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all" 
                                                title="Audit Negotiation"
                                            >
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-[11px] font-bold leading-relaxed">
                            <span className="font-black uppercase tracking-widest mr-2">Pro-Tip for Admins:</span> 
                            Negotiations in "ACCEPTED" status for more than 48 hours without a contract signature will trigger a manual audit alert.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
