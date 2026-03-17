"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Package, ShoppingBag, Eye } from "lucide-react";

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetchOrders();
        } else if (status === "unauthenticated") {
            window.location.href = `/login?callbackUrl=${encodeURIComponent("/orders")}`;
        }
    }, [status]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } else if (res.status === 401) {
                window.location.href = `/login?callbackUrl=${encodeURIComponent("/orders")}`;
            }
        } catch (err) {
            console.error("Orders fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="bg-white"><Navbar /><div className="page-container flex justify-center items-center min-h-[60vh]"><div className="spinner w-8 h-8" /></div></div>
    );

    return (
        <div className="bg-white">
            <Navbar />
            <div className="page-container">
                <h1 className="section-title">My Orders</h1>
                <p className="section-sub">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

                {orders.length === 0 ? (
                    <div className="card text-center py-20">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" style={{ color: "var(--text-muted)" }} />
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No orders yet</h3>
                        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Once you place an order, it will appear here.</p>
                        <Link href="/products" className="btn-primary inline-flex">Browse Products</Link>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="font-mono text-xs" style={{ color: "var(--text-primary)" }}>#{order._id.slice(-8).toUpperCase()}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{order.vendorOrders?.reduce((s, v) => s + v.items?.length, 0) || 0} item(s)</td>
                                        <td className="font-semibold text-slate-900">UGX {order.total?.toLocaleString()}</td>
                                        <td><StatusBadge status={order.paymentStatus} size="sm" /></td>
                                        <td><StatusBadge status={order.vendorOrders?.[0]?.status || "PENDING"} size="sm" /></td>
                                        <td>
                                            <Link href={`/orders/${order._id}`} className="btn-ghost text-xs px-3 py-1.5">View →</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
