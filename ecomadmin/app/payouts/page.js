"use client";
import { useState, useEffect } from "react";
import { DollarSign, Clock, CheckCircle, AlertCircle, Search, Filter, ArrowUpRight, Send, User, Wallet } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const mockPayouts = [
    { id: "P_001", vendor: "Auto Parts Pro", amount: 450000, momo: "+256 700 000 001", status: "PENDING", date: "2024-03-15" },
    { id: "P_002", vendor: "Brake Specialists", amount: 1200000, momo: "+256 750 123 456", status: "PENDING", date: "2024-03-14" },
    { id: "P_003", vendor: "Tire Hub", amount: 800000, momo: "+256 788 999 000", status: "COMPLETED", date: "2024-03-10" },
    { id: "P_004", vendor: "Engine Master", amount: 2500000, momo: "+256 701 555 444", status: "FAILED", date: "2024-03-08" },
];

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState(mockPayouts);
    const [filter, setFilter] = useState("ALL");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const stats = [
        { label: "Total Paid Out", value: "UGX 12.8M", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        { label: "Pending Requests", value: "UGX 1.65M", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Platform Commission", value: "UGX 3.4M", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
    ];

    const handleProcess = (id) => {
        setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "COMPLETED" } : p));
        alert(`Payout ${id} marked as processed.`);
    };

    const filteredPayouts = filter === "ALL" ? payouts : payouts.filter(p => p.status === filter);

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Vendor Payouts</h1>
                <p className="text-slate-500 text-sm mt-1">Manage and verify financial transfers to marketplace vendors.</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-5">
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
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h3 className="font-black text-slate-900 uppercase tracking-tight">Payout Requests</h3>
                        <div className="flex items-center gap-2">
                            {["ALL", "PENDING", "COMPLETED", "FAILED"].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setFilter(s)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border transition-all ${
                                        filter === s 
                                        ? "bg-slate-900 text-white border-slate-900" 
                                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
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
                            placeholder="Search vendors..." 
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Method</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPayouts.map((payout) => (
                                <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                {payout.vendor[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900">{payout.vendor}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">{payout.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900 font-mono">
                                        UGX {mounted ? payout.amount.toLocaleString('en-US') : payout.amount}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 px-2 border border-slate-200 rounded-lg bg-white shadow-sm flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-[11px] font-black text-slate-700 font-mono tracking-tighter">{payout.momo}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={payout.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {payout.status === "PENDING" ? (
                                            <button 
                                                onClick={() => handleProcess(payout.id)}
                                                className="px-4 py-2 bg-[#BFFCF6] text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 border border-slate-200"
                                            >
                                                Process Now
                                            </button>
                                        ) : (
                                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
