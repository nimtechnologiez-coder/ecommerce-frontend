"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShoppingBag } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

const STATUS_FILTERS = ["All", "PENDING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

// Demo data shown while real data loads or as fallback
const DEMO_ORDERS = [
    { id: "A1B2C3D4", date: "Mar 9, 2024", customer: "James Okello", items: 3, amount: 120000, status: "PENDING" },
    { id: "E5F6G7H8", date: "Mar 8, 2024", customer: "Sarah Nakato", items: 1, amount: 45000, status: "PACKED" },
    { id: "I9J0K1L2", date: "Mar 7, 2024", customer: "David Mugisha", items: 2, amount: 320000, status: "SHIPPED" },
    { id: "M3N4O5P6", date: "Mar 5, 2024", customer: "Grace Apio", items: 1, amount: 85000, status: "DELIVERED" },
    { id: "Q7R8S9T0", date: "Mar 3, 2024", customer: "Peter Ssali", items: 4, amount: 195000, status: "DELIVERED" },
];

const STATUS_COLORS = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    PACKED: "bg-blue-100 text-blue-700 border-blue-200",
    SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
    DELIVERED: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export default function VendorOrdersPage() {
    const [filter, setFilter] = useState("All");
    const [orders, setOrders] = useState(DEMO_ORDERS);
    const { data: session } = useSession();

    const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

    const totalRevenue = orders
        .filter(o => o.status === "DELIVERED")
        .reduce((sum, o) => sum + (o.amount || 0), 0);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900">Orders</h1>
                <p className="text-sm text-slate-500 mt-1">{orders.length} total orders</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Orders", value: orders.length, color: "text-slate-900", bg: "bg-slate-50" },
                    { label: "Pending", value: orders.filter(o => o.status === "PENDING").length, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "In Transit", value: orders.filter(o => o.status === "SHIPPED").length, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Delivered Revenue", value: `UGX ${totalRevenue.toLocaleString()}`, color: "text-green-600", bg: "bg-green-50" },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`${bg} border border-slate-200 rounded-2xl p-4`}>
                        <div className={`text-xl font-black ${color} mb-1`}>{value}</div>
                        <div className="text-xs text-slate-400">{label}</div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {STATUS_FILTERS.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            filter === s
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                        }`}
                    >
                        {s}
                        {s !== "All" && (
                            <span className="ml-1.5 opacity-60">
                                ({orders.filter(o => o.status === s).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            {filtered.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl text-center py-20">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-slate-200" />
                    <p className="text-slate-400">No orders with this status.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Items</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">{order.date}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{order.customer}</td>
                                    <td className="px-6 py-4 text-slate-500">{order.items} item{order.items !== 1 ? "s" : ""}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">
                                        UGX {(order.amount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Manage →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
