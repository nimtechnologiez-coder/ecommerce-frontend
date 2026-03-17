"use client";

import { useState, useTransition } from "react";
import { reviewProduct } from "./actions";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

export default function ProductReviewActions({ productId, currentStatus, currentRemarks }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState(null);
    const [remarks, setRemarks] = useState(currentRemarks || "");

    const handleAction = (status) => {
        startTransition(async () => {
            setMessage(null);
            
            // Require remarks if rejecting
            if (status === "REJECTED" && !remarks.trim()) {
                setMessage({ type: "error", text: "Please provide a reason for rejection in the remarks field." });
                return;
            }

            const result = await reviewProduct(productId, status, remarks);
            if (result.success) {
                setMessage({ type: "success", text: result.message });
            } else {
                setMessage({ type: "error", text: result.error });
            }
            setTimeout(() => setMessage(null), 3000);
        });
    };

    return (
        <div className="card space-y-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle size={14} className="text-primary" /> Review Actions
            </h3>

            {message && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    message.type === "success" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                    {message.type === "success" ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {message.text}
                </div>
            )}

            <div className="space-y-3">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Remarks (Optional/Required for Reject)</label>
                    <textarea 
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter feedback for the vendor..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[80px]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        disabled={isPending || currentStatus === "LIVE"}
                        onClick={() => handleAction("LIVE")}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                            currentStatus === "LIVE" 
                                ? "bg-emerald-500 text-white cursor-default" 
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 border border-emerald-200"
                        }`}
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                    <button
                        disabled={isPending || currentStatus === "REJECTED"}
                        onClick={() => handleAction("REJECTED")}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                            currentStatus === "REJECTED" 
                                ? "bg-red-500 text-white cursor-default" 
                                : "bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 border border-red-200"
                        }`}
                    >
                        <XCircle size={16} /> Reject
                    </button>
                </div>

                {currentStatus !== "PENDING" && currentStatus !== "DRAFT" && (
                     <button
                        disabled={isPending}
                        onClick={() => handleAction("PENDING")}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all text-xs font-bold disabled:opacity-50"
                    >
                        <Clock size={14} /> Revert to Pending
                    </button>
                )}
            </div>
            {isPending && <p className="text-[10px] text-slate-400 font-bold animate-pulse text-center pt-2">Processing decision...</p>}
        </div>
    );
}
