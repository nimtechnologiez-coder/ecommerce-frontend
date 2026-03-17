"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Wallet, AlertTriangle, TrendingUp, Clock, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import StatusBadge from "@/components/StatusBadge";

const stats = [
    { label: "Total Orders", value: "48", Icon: ShoppingBag, color: "#059669", bg: "rgba(5,150,105,0.1)" },
    { label: "Pending Orders", value: "7", Icon: Clock, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { label: "Wallet Balance", value: "UGX 1,240,000", Icon: Wallet, color: "#00B341", bg: "rgba(0,179,65,0.1)" },
    { label: "Total Products", value: "23", Icon: Package, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
];
const recentOrders = [
    { id: "A1B2C3D4", date: "Mar 9, 2024", amount: "UGX 120,000", status: "PENDING" },
    { id: "E5F6G7H8", date: "Mar 8, 2024", amount: "UGX 45,000", status: "PACKED" },
    { id: "I9J0K1L2", date: "Mar 7, 2024", amount: "UGX 320,000", status: "SHIPPED" },
];
const lowStock = [
    { name: "Honda Brake Pads", stock: 2, category: "Brakes" },
    { name: "Toyota Oil Filter", stock: 4, category: "Engine" },
    { name: "LED Headlight H4", stock: 3, category: "Electrical" },
];

export default function VendorDashboard() {
    const { data: session } = useSession();
    const [kycStatus, setKycStatus] = useState("loading");

    useEffect(() => {
        fetch("/api/vendor/kyc")
            .then(async res => {
                if (!res.ok) {
                    if (res.status === 404) return setKycStatus("NOT_SUBMITTED");
                    throw new Error("Failed to load");
                }
                const data = await res.json();
                setKycStatus(data.kycStatus || "PENDING");
            })
            .catch(() => setKycStatus("ERROR"));
    }, []);

    return (
        <div className="p-8">
            {kycStatus === "NOT_SUBMITTED" && (
                <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl mt-0.5">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Action Required: Complete Your Vendor Verification</h3>
                        <p className="text-sm text-slate-600 mt-1 mb-3">You must submit your business and ID documents before you can list products on the marketplace.</p>
                        <Link href="/kyc" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-all">
                            Complete KYC Now →
                        </Link>
                    </div>
                </div>
            )}

            {kycStatus === "PENDING" && (
                <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mt-0.5">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Verification Under Review</h3>
                        <p className="text-sm text-slate-600 mt-1 mb-3">Your KYC documents have been submitted and are currently being reviewed by our admin team. You&apos;ll be able to add products once approved.</p>
                        <Link href="/kyc" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl text-sm font-bold shadow-sm border border-blue-200 hover:bg-blue-50 transition-all">
                            View Submission
                        </Link>
                    </div>
                </div>
            )}

            {kycStatus === "REJECTED" && (
                <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl mt-0.5">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Verification Rejected</h3>
                        <p className="text-sm text-slate-600 mt-1 mb-3">There was an issue with your KYC documents. Please review the admin notes and re-submit your documentation.</p>
                        <Link href="/kyc" className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold shadow-md shadow-red-500/20 hover:bg-red-600 transition-all">
                            Update KYC Documents →
                        </Link>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Vendor Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {session?.user?.role === "ADMIN" 
                            ? `Welcome Admin (${session?.user?.name})! You are viewing the vendor panel in testing mode.` 
                            : `Welcome back, ${session?.user?.name || "Vendor"}! Here's your store overview.`}
                    </p>
                </div>
                {kycStatus === "APPROVED" || session?.user?.role === "ADMIN" ? (
                    <Link href="/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold hover:bg-[#A5F0E8] transition-colors">
                        <Plus size={16} /> Add Product
                    </Link>
                ) : (
                    <button disabled className="opacity-50 cursor-not-allowed flex items-center gap-2 px-4 py-2.5 bg-slate-200 text-slate-500 rounded-xl text-sm font-bold" title="Complete KYC first">
                        <Plus size={16} /> Add Product
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map(({ label, value, Icon, color, bg }) => (
                    <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                                <Icon size={20} style={{ color }} />
                            </div>
                            <TrendingUp size={14} className="text-green-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
                        <div className="text-xs text-slate-400">{label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900">Recent Orders</h2>
                        <Link href="/orders" className="text-xs text-blue-600 hover:underline">View all →</Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-900">#{order.id}</div>
                                    <div className="text-xs text-slate-400">{order.date}</div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{order.amount}</span>
                                <StatusBadge status={order.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={18} className="text-amber-500" />
                        <h2 className="font-bold text-slate-900">Low Stock Alerts</h2>
                    </div>
                    <div className="space-y-3 mb-6">
                        {lowStock.map((item) => (
                            <div key={item.name} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs text-slate-400">{item.category}</span>
                                    <span className="text-xs font-bold text-amber-600">Only {item.stock} left</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                        <h3 className="font-bold text-sm text-slate-900 mb-3">Quick Links</h3>
                        <div className="space-y-1">
                            {[
                                { label: "Add New Product", href: "/products/new" },
                                { label: "Manage Smart Trade", href: "/trade" },
                                { label: "View My Products", href: "/products" },
                                { label: "Manage Orders", href: "/orders" },
                                { label: "Check Wallet", href: "/wallet" },
                            ].map(link => (
                                <Link key={link.href} href={link.href} className="block text-sm py-1.5 text-slate-500 hover:text-slate-900 transition-colors">
                                    → {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
