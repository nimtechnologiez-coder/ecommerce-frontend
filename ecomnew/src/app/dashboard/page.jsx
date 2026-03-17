"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/shared/StatusBadge";
import { 
    ShoppingBag, Heart, MapPin, Settings, Package, 
    ArrowRight, TrendingUp, Clock, CheckCircle2, 
    RotateCcw, Loader2, User 
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/dashboard");
        } else if (status === "authenticated") {
            fetchStats();
        }
    }, [status]);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/user/stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error("Stats fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || status === "loading") {
        return (
            <div style={{ background: "var(--bg-dark)" }}>
                <Navbar />
                <div className="min-h-[70vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    const statCards = [
        { label: "Total Orders", value: stats?.totalOrders || 0, icon: <ShoppingBag />, color: "bg-blue-50 text-blue-600", href: "/orders" },
        { label: "Wishlist Items", value: stats?.wishlistCount || 0, icon: <Heart />, color: "bg-red-50 text-red-600", href: "/wishlist" },
        { label: "Saved Addresses", value: stats?.addressCount || 0, icon: <MapPin />, color: "bg-emerald-50 text-emerald-600", href: "/profile/addresses" },
        { label: "Active Returns", value: stats?.returnCount || 0, icon: <RotateCcw />, color: "bg-orange-50 text-orange-600", href: "/returns" },
    ];

    return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            
            <main className="page-container py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 glass-card p-8 border-none shadow-2xl shadow-primary/5">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-lg">
                                <User size={40} className="text-slate-900" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 leading-tight">Welcome back, <span className="gradient-text italic">{session?.user?.name?.split(' ')[0]}!</span></h1>
                                <p className="text-slate-500 font-medium">Here's what's happening with your account today.</p>
                            </div>
                        </div>
                        <Link href="/profile" className="btn-outline px-6 h-12 flex items-center gap-2 rounded-xl text-sm font-bold">
                            <Settings size={18} /> EDIT PROFILE
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {statCards.map((stat) => (
                            <Link key={stat.label} href={stat.href} className="card p-6 group hover:-translate-y-1 transition-all border-none shadow-lg shadow-slate-200/50">
                                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{stat.label}</div>
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Clock size={20} className="text-primary-dark" /> RECENT ORDERS
                                </h2>
                                <Link href="/orders" className="text-xs font-black text-primary-dark hover:underline tracking-widest uppercase">
                                    VIEW ALL
                                </Link>
                            </div>

                            {stats?.recentOrders?.length === 0 ? (
                                <div className="card text-center py-16 border-none shadow-lg shadow-slate-200/50">
                                    <ShoppingBag size={40} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
                                    <Link href="/products" className="btn-ghost mt-4 inline-flex text-primary">Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {stats.recentOrders.map((order) => (
                                        <div key={order._id} className="card p-5 hover:bg-slate-50 transition-all border-none shadow-md shadow-slate-200/30 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                                    <Package size={24} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</div>
                                                    <div className="text-[10px] text-slate-500 font-medium">{new Date(order.createdAt).toLocaleDateString()} • {order.itemsCount || 0} items</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-sm font-black text-slate-900">UGX {order.total?.toLocaleString()}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{order.paymentStatus}</div>
                                                </div>
                                                <Link href={`/orders/${order._id}`} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all">
                                                    <ArrowRight size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Side Actions / Quick Links */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                                <TrendingUp size={20} className="text-primary-dark" /> QUICK ACTIONS
                            </h2>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/wishlist" className="card p-4 flex items-center gap-4 hover:bg-red-50 transition-all group border-none shadow-md shadow-slate-200/20">
                                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                                        <Heart size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">My Wishlist</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">View saved parts</div>
                                    </div>
                                    <ArrowRight size={16} className="ml-auto text-slate-200 group-hover:text-red-400 transition-colors" />
                                </Link>

                                <Link href="/profile/addresses" className="card p-4 flex items-center gap-4 hover:bg-emerald-50 transition-all group border-none shadow-md shadow-slate-200/20">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Saved Addresses</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Manage locations</div>
                                    </div>
                                    <ArrowRight size={16} className="ml-auto text-slate-200 group-hover:text-emerald-400 transition-colors" />
                                </Link>

                                <Link href="/returns" className="card p-4 flex items-center gap-4 hover:bg-orange-50 transition-all group border-none shadow-md shadow-slate-200/20">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <RotateCcw size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Returns & Refunds</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">Check return status</div>
                                    </div>
                                    <ArrowRight size={16} className="ml-auto text-slate-200 group-hover:text-orange-400 transition-colors" />
                                </Link>
                            </div>

                            {/* Promotional card */}
                            <div className="card p-8 bg-slate-900 text-white relative overflow-hidden mt-8 border-none shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <h3 className="text-lg font-black mb-2 relative z-10">Premium Member</h3>
                                <p className="text-slate-400 text-xs mb-6 relative z-10">You're currently on the elite tier. Enjoy exclusive car part deals.</p>
                                <Link href="/products" className="btn-primary h-10 px-6 text-xs w-full justify-center">
                                    SHOP EXCLUSIVE DEALS
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
