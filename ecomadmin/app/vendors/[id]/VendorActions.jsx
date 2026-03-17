"use client";

import { useState } from "react";
import { updateVendorStatus } from "./actions";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VendorActions({ vendorId, currentStatus }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleAction = async (status) => {
        if (!confirm(`Are you sure you want to set this vendor to ${status}?`)) return;
        
        setLoading(true);
        setMessage(null);
        
        const result = await updateVendorStatus(vendorId, status);
        
        if (result.success) {
            setMessage({ type: "success", text: result.message });
        } else {
            setMessage({ type: "error", text: result.error });
        }
        
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full">
                <button 
                    onClick={() => handleAction("REJECTED")}
                    disabled={loading || currentStatus === "REJECTED"}
                    className="btn-outline border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2 text-sm h-10 px-4 flex-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                    Reject Vendor
                </button>
                <button 
                    onClick={() => handleAction("APPROVED")}
                    disabled={loading || currentStatus === "APPROVED"}
                    className="bg-primary text-slate-900 px-6 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Approve Access
                </button>
            </div>
            {message && (
                <div className={`mt-2 p-2 rounded-lg text-xs font-bold text-center ${
                    message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}
