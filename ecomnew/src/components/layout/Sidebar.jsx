"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
    Car, LayoutDashboard, Package, ShoppingBag, Wallet, FileText,
    Users, ArrowLeftRight, LogOut, CheckSquare, DollarSign, Menu, X, ChevronRight
} from "lucide-react";


const vendorLinks = [
    { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vendor/kyc", label: "KYC Verification", icon: CheckSquare },
    { href: "/vendor/products", label: "Products", icon: Package },
    { href: "/vendor/orders", label: "Orders", icon: ShoppingBag },
    { href: "/vendor/wallet", label: "Wallet", icon: Wallet },
];

const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/vendors", label: "Vendor Approvals", icon: Users },
    { href: "/admin/products", label: "Product Approvals", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/refunds", label: "Refunds", icon: RotateCcw },
    { href: "/admin/payouts", label: "Payouts", icon: DollarSign },
    { href: "/admin/trade", label: "Smart Trade", icon: ArrowLeftRight },
];

export default function Sidebar({ role }) {
    const pathname = usePathname();
    const links = role === "VENDOR" ? vendorLinks : adminLinks;
    const title = role === "VENDOR" ? "Vendor Panel" : "Admin Panel";
    const accentColor = "var(--primary-dark)";
    const gradientStyle = "var(--primary)";

    const [mobileOpen, setMobileOpen] = useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-100" style={{ background: gradientStyle }}>
                        <Car size={16} className="text-slate-900" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-sm leading-none">PHAMON</div>
                        <div className="text-[9px] font-semibold" style={{ color: accentColor }}>{title}</div>
                    </div>
                </div>
                {/* Close button on mobile */}
                <button className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }} onClick={() => setMobileOpen(false)}>
                    <X size={14} />
                </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className="sidebar-link"
                            style={isActive ? { background: `rgba(${role === "VENDOR" ? "0,102,204" : "255,107,0"},0.12)`, color: accentColor, borderColor: `rgba(${role === "VENDOR" ? "0,102,204" : "255,107,0"},0.25)` } : {}}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                            {isActive && <ChevronRight size={13} className="ml-auto opacity-50" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t shrink-0" style={{ borderColor: "var(--border)" }}>
                <Link href="/" onClick={() => setMobileOpen(false)} className="sidebar-link text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                    ← Back to Storefront
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="sidebar-link w-full text-left"
                    style={{ color: "#EF4444" }}
                >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-white" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-100" style={{ background: gradientStyle }}>
                        <Car size={13} className="text-slate-900" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">PHAMON <span className="font-normal text-xs" style={{ color: accentColor }}>{title}</span></span>
                </div>
                <button onClick={() => setMobileOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    <Menu size={15} /> Menu
                </button>
            </div>

            {/* Mobile drawer overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute top-0 left-0 bottom-0 w-64 shadow-2xl animate-slide-in" style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop fixed sidebar */}
            <div className="sidebar hidden lg:flex">
                <SidebarContent />
            </div>
        </>
    );
}
