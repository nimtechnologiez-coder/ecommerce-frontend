import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { ShoppingBag, ChevronRight, User, CreditCard } from "lucide-react";

export default async function OrdersPage() {
    await dbConnect();
    const orders = await Order.find().populate('userId').sort({ createdAt: -1 });

    return (
        <div className="admin-main-container space-y-6">
            <div>
                <h1 className="heading-lg text-slate-900 font-bold text-2xl">Platform Orders</h1>
                <p className="text-sm text-slate-500">Monitor all transactions across the store.</p>
            </div>

            <div className="card !p-0 overflow-hidden">
                {/* Desktop View */}
                <div className="desktop-table-view overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-primary font-bold">#{order._id.toString().slice(-8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="text-slate-700 font-bold">{order.deliveryAddress?.name || order.userId?.name || "Guest"}</div>
                                        <div className="text-[10px] text-slate-400">{order.userId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 font-mono text-sm">UGX {(order.total || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.paymentStatus} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/orders/${order._id}`} className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="mobile-card-view divide-y divide-[#21262D]">
                    {orders.map((order) => (
                        <div key={order._id} className="p-4 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">Order ID: #{order._id.toString().slice(-8).toUpperCase()}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                            <User size={14} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{order.deliveryAddress?.name || "Guest"}</div>
                                            <div className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <StatusBadge status={order.paymentStatus} />
                            </div>

                             <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <CreditCard size={14} className="text-slate-400" />
                                    <span className="text-xs text-slate-400">Total Amount</span>
                                </div>
                                <div className="text-sm font-black text-slate-900 font-mono">UGX {(order.total || 0).toLocaleString()}</div>
                            </div>

                             <Link href={`/orders/${order._id}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 active:scale-95 transition-transform">
                                View Full Invoice <ChevronRight size={14} />
                            </Link>
                        </div>
                    ))}
                </div>

                 {orders.length === 0 && (
                    <div className="p-20 text-center text-slate-400">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm italic">No platform orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
