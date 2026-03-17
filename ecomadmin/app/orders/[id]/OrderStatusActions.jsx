"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "./actions";
import { CheckCircle, XCircle, Package, Truck } from "lucide-react";

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const DELIVERY_STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusActions({ orderId, currentPaymentStatus, currentDeliveryStatus }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState(null);

    const handleUpdate = (type, status) => {
        startTransition(async () => {
            setMessage(null);
            const result = await updateOrderStatus(orderId, status, type);
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
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <CheckCircle size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Order Actions</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Update Status</p>
                </div>
            </div>

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
                <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Package size={10} /> Payment Status
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {PAYMENT_STATUSES.map(status => (
                            <button
                                key={status}
                                disabled={isPending || status === currentPaymentStatus}
                                onClick={() => handleUpdate("paymentStatus", status)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                    status === currentPaymentStatus
                                        ? "bg-primary text-slate-900 cursor-default"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Truck size={10} /> Delivery Status
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {DELIVERY_STATUSES.map(status => (
                            <button
                                key={status}
                                disabled={isPending || status === currentDeliveryStatus}
                                onClick={() => handleUpdate("deliveryStatus", status)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                    status === currentDeliveryStatus
                                        ? "bg-blue-500 text-white cursor-default"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {isPending && <p className="text-[10px] text-slate-400 font-bold animate-pulse">Saving changes...</p>}
        </div>
    );
}
