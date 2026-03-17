"use client";

import { useState } from "react";
import { updateReturnStatus } from "./actions";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function RefundActions({ returnId, currentStatus }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleAction = async (status) => {
        if (!confirm(`Are you sure you want to set this return request to ${status}?`)) return;
        
        setLoading(true);
        setMessage(null);
        
        const result = await updateReturnStatus(returnId, status);
        
        if (result.success) {
            setMessage({ type: "success", text: result.message });
        } else {
            setMessage({ type: "error", text: result.error });
        }
        
        setLoading(false);
    };

    if (currentStatus === "APPROVED" || currentStatus === "REJECTED") {
        return null; // Hide actions if already processed
    }

    return (
        <div className="flex flex-col gap-2 w-full mt-4">
            <div className="flex gap-2 w-full">
                <button 
                    onClick={() => handleAction("REJECTED")}
                    disabled={loading}
                    className="btn-outline border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2 text-xs h-8 px-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                    Reject
                </button>
                <button 
                    onClick={() => handleAction("APPROVED")}
                    disabled={loading}
                    className="bg-primary text-slate-900 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    Approve
                </button>
            </div>
            {message && (
                <div className={`mt-2 p-2 rounded-lg text-[10px] font-bold text-center ${
                    message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}
