"use client";
import { useState, useEffect } from "react";
import { Wallet, TrendingUp, Clock, CheckCircle, ArrowRightLeft, CreditCard, AlertCircle, Sparkles, Send } from "lucide-react";

const transactions = [
    { id: "T001", date: "Mar 9", description: "Order #A1B2C3D4 - Commission", amount: 85500, type: "credit" },
    { id: "T002", date: "Mar 8", description: "Payout to +256 700 000 000", amount: -500000, type: "debit" },
    { id: "T003", date: "Mar 7", description: "Order #I9J0K1L2 - Commission", amount: 304000, type: "credit" },
    { id: "T004", date: "Mar 5", description: "Order #M3N4O5P6 - Commission", amount: 80750, type: "credit" },
];

export default function VendorWalletPage() {
    const [kycDocs, setKycDocs] = useState(null);
    const [requesting, setRequesting] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

    const walletBalance = 1240000;
    const pendingBalance = 470250;
    const paidOut = 2150000;

    useEffect(() => {
        fetch("/api/vendor/kyc")
            .then(res => res.json())
            .then(data => setKycDocs(data.kycDocs))
            .catch(err => console.error("Failed to load KYC for wallet", err));
    }, []);

    const handleRequestPayout = () => {
        if (walletBalance < 10000) {
            alert("Minimum payout amount is UGX 10,000");
            return;
        }
        setRequesting(true);
        setTimeout(() => {
            setRequesting(false);
            setRequestSuccess(true);
            setTimeout(() => setRequestSuccess(false), 5000);
        }, 2000);
    };

    return (
        <div className="p-8 pb-32">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Financial Wallet</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your earnings, payouts, and financial performance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Wallet size={120} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Available Balance</div>
                            <div className="text-4xl font-black font-mono">UGX {walletBalance.toLocaleString()}</div>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-xs font-bold text-green-400">
                            <TrendingUp size={14} />
                            +12% from last week
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Pending Clearance</div>
                                <div className="text-lg font-black text-slate-900">UGX {pendingBalance.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Lifetime Payouts</div>
                                <div className="text-lg font-black text-slate-900">UGX {paidOut.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Payout Method</h3>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registered Momo Number</div>
                            <div className="text-sm font-black text-slate-700">{kycDocs?.momoNumber || "Loading..."}</div>
                            <div className="text-[9px] text-slate-400 mt-2 italic">* Funds are sent automatically to this number</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleRequestPayout}
                        disabled={requesting || requestSuccess}
                        className={`mt-6 w-full py-4 rounded-2xl font-black text-sm tracking-tight transition-all flex items-center justify-center gap-2 ${
                            requestSuccess 
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
                            : "bg-[#BFFCF6] text-slate-900 hover:shadow-xl hover:-translate-y-0.5"
                        }`}
                    >
                        {requesting ? (
                            <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        ) : requestSuccess ? (
                            <><CheckCircle size={18} /> REQUEST SENT</>
                        ) : (
                            <><Send size={18} /> REQUEST PAYOUT</>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900">Transaction History</h3>
                            <button className="text-xs font-black text-blue-600 hover:underline">DOWNLOAD CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-slate-100 uppercase tracking-widest">
                                        <th className="pb-4 text-[10px] font-black text-slate-400">Date</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400">Activity</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 text-right">Amount</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {transactions.map(tx => (
                                        <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 text-xs font-bold text-slate-400">{tx.date}</td>
                                            <td className="py-4 text-sm font-bold text-slate-900">{tx.description}</td>
                                            <td className={`py-4 text-sm font-black text-right ${tx.type === "credit" ? "text-green-600" : "text-rose-500"}`}>
                                                {tx.type === "credit" ? "+" : "-"}UGX {Math.abs(tx.amount).toLocaleString()}
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    tx.type === "credit" ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                                }`}>
                                                    {tx.type === "credit" ? "Settled" : "Paid"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 relative overflow-hidden">
                        <Sparkles className="absolute -top-4 -right-4 text-indigo-100 w-24 h-24" />
                        <h4 className="text-md font-black text-indigo-900 mb-4 flex items-center gap-2">
                             <AlertCircle size={18} /> Clearance Cycle
                        </h4>
                        <div className="space-y-4">
                            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                                PHAMON operates on a <span className="font-black">14-day clearance window</span> for all orders to ensure buyer satisfaction and handle potential returns.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-black">1</div>
                                    <span className="text-[11px] font-bold text-indigo-900">Order is delivered to buyer</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-black">2</div>
                                    <span className="text-[11px] font-bold text-indigo-900">Funds enter "Pending" state</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-black">3</div>
                                    <span className="text-[11px] font-bold text-indigo-900">14 days pass safely</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-black">4</div>
                                    <span className="text-[11px] font-bold text-indigo-900 text-green-600">Funds move to "Available"</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Payout Guidelines</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                <span className="text-xs text-slate-600 font-medium">Platform commission of 5% is deducted at origin.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                <span className="text-xs text-slate-600 font-medium">Payouts are processed within 24 hours of request.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                <span className="text-xs text-slate-600 font-medium">Maximum weekly payout limit is UGX 50M.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
