"use client";
import { useState, use } from "react";
import Link from "next/link";
import { Save, Truck, ArrowLeft } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export default function VendorOrderDetailPage({ params }) {
    const { id } = use(params);
    const [status, setStatus] = useState("PENDING");
    const [courier, setCourier] = useState("");
    const [tracking, setTracking] = useState("");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const order = {
        id: id,
        customer: { name: "James Okello", phone: "+256 700 123 456", address: "Kampala Road, Kampala" },
        items: [
            { name: "Toyota Oil Filter", qty: 2, price: 35000 },
            { name: "Wiper Blades", qty: 1, price: 28000 }
        ],
        total: 98000,
        date: "Mar 9, 2024",
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-6">
                <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3 transition-colors">
                    <ArrowLeft size={14} /> Back to Orders
                </Link>
                <h1 className="text-2xl font-black text-slate-900">Order #{id}</h1>
                <p className="text-sm text-slate-500 mt-1">Placed on {order.date}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Order Details */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Customer Info */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Customer Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Name</div>
                                <div className="font-medium text-slate-900">{order.customer.name}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Phone</div>
                                <div className="font-medium text-slate-900">{order.customer.phone}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Delivery Address</div>
                                <div className="font-medium text-slate-900">{order.customer.address}</div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-lg flex-shrink-0">
                                        ⚙️
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900 truncate">{item.name}</div>
                                        <div className="text-xs text-slate-400">Qty: {item.qty} × UGX {item.price.toLocaleString()}</div>
                                    </div>
                                    <div className="font-semibold text-sm text-slate-900 flex-shrink-0">
                                        UGX {(item.price * item.qty).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                            <span className="font-bold text-slate-900">Order Total</span>
                            <span className="font-black text-lg text-slate-900">UGX {order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Update Status */}
                <div className="space-y-4">
                    {/* Current Status */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 mb-3">Current Status</h3>
                        <StatusBadge status={status} />
                    </div>

                    {/* Update Status */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Update Order</h3>
                        <div className="space-y-3">
                            {/* Status Select */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">New Status</label>
                                <select
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                >
                                    {["PENDING", "PACKED", "SHIPPED", "DELIVERED"].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Shipping details — only when SHIPPED */}
                            {status === "SHIPPED" && (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Courier Company</label>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                            placeholder="e.g. DHL, Aramex, Posta Uganda"
                                            value={courier}
                                            onChange={e => setCourier(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Tracking Number</label>
                                        <div className="relative">
                                            <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                                placeholder="TRK123456789"
                                                value={tracking}
                                                onChange={e => setTracking(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Success message */}
                            {saved && (
                                <div className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                                    ✅ Order updated successfully!
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
                            >
                                <Save size={15} /> Save Update
                            </button>
                        </div>
                    </div>

                    {/* Payout Note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700">
                        💡 <strong>Payout Note:</strong> Your earnings are released after the order is marked as <strong>DELIVERED</strong>. Platform commission: 5%.
                    </div>
                </div>
            </div>
        </div>
    );
}
