"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
    Car, LayoutDashboard, Package, ShoppingBag, Users, ArrowLeftRight, LogOut, Menu, X, ChevronRight, RotateCcw, DollarSign, Settings, TrendingUp, Wallet, Gavel, ShieldCheck
} from "lucide-react";

    const vendorLinks = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Performance Analytics", icon: TrendingUp, href: "/analytics" },
        { label: "Inventory & Stock", icon: Package, href: "/inventory" },
        { label: "My Products", icon: ShoppingBag, href: "/products" },
        { label: "Orders", icon: Package, href: "/orders" },
        { label: "Financial Wallet", icon: Wallet, href: "/wallet" },
        { label: "Smart Trade Portal", icon: Gavel, href: "/trade" },
        { label: "Identification (KYC)", icon: ShieldCheck, href: "/kyc" },
        { label: "Store Settings", icon: Settings, href: "/settings" },
    ];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#BFFCF6]">
            <div className="flex items-center justify-between px-6 py-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Car size={22} className="text-white" />
                    </div>
                    <div>
                        <div className="font-black text-slate-900 text-lg tracking-tight leading-none uppercase">PH-VENDOR</div>
                        <div className="text-[10px] font-bold text-slate-700 tracking-widest uppercase mt-0.5">Automotive SaaS</div>
                    </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hide-scrollbar pt-2">
                {vendorLinks.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? "bg-white text-slate-900 shadow-xl shadow-primary/20 font-black border border-white"
                                : "text-slate-700 hover:bg-white/50 hover:text-slate-900"
                                }`}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[14px]">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 py-2 border-t border-slate-900/10">
                <a href={process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000"} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 transition-all text-xs font-bold">
                    <ArrowLeftRight size={16} />
                    <span>Back to Storefront</span>
                </a>
            </div>

            <div className="p-4 border-t border-slate-900/10">
                <button
                    onClick={() => signOut({ callbackUrl: (process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000") + "/vendor/login" })}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all text-sm font-bold"
                >
                    <LogOut size={20} />
                    <span>Terminal Session</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#BFFCF6] flex items-center justify-center border border-slate-200">
                        <Car size={18} className="text-slate-900" />
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">PHAMON</span>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 border border-slate-700/50"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute top-0 left-0 bottom-0 w-[280px] sidebar-shadow animate-slide-in-left">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-72 hidden lg:block z-30 sidebar-shadow">
                <SidebarContent />
            </aside>
        </>
    );
}
