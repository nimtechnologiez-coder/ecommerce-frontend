"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Menu, X, Car, Search, Heart, ChevronDown, LayoutDashboard, Package, LogOut, ShoppingBag, Settings, ExternalLink, Store } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const userMenuRef = useRef(null);

    // Refresh cart count
    useEffect(() => {
        const fetchCart = async () => {
            if (session) {
                try {
                    const res = await fetch("/api/cart");
                    if (res.ok) {
                        const data = await res.json();
                        setCartCount(data.items?.length || 0);
                    }
                } catch (err) { }
            } else {
                setCartCount(0);
            }
        };
        fetchCart();
    }, [session]);

    // Close user dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const role = session?.user?.role;
    const firstName = session?.user?.name?.split(" ")[0];

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "About", href: "/about" },
    ];

    return (
        <>
            <nav className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md" style={{ borderColor: "var(--border-muted)" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center h-16 gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setMobileOpen(false)}>
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-slate-100">
                                <Car size={20} className="text-slate-900" />
                            </div>
                            <div className="hidden sm:block">
                                <div className="font-bold text-slate-900 text-lg tracking-tight leading-none">PHAMON</div>
                                <div className="text-[10px] font-bold tracking-[0.2em] mt-0.5 text-primary-dark">AUTOMOTIVES</div>
                            </div>
                        </Link>

                        {/* Search bar — desktop */}
                        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4 pb-0.5">
                            <div className="relative w-full group">
                                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary-dark" style={{ color: "var(--text-muted)" }} />
                                <input
                                    type="text"
                                    placeholder="     Search parts, brands, vehicles..."
                                    className="input-field pl-11 py-2 text-sm bg-slate-50 border-slate-200 hover:bg-white focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Spacer on mobile */}
                        <div className="flex-1 lg:hidden" />

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-2">
                            {navLinks.map(l => (
                                <Link key={l.href} href={l.href} className="btn-ghost text-sm font-semibold px-4 py-2 hover:bg-primary/20 active:scale-95 transition-all text-slate-600 hover:text-slate-900">
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Cart — always visible */}
                        <Link href="/cart" className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-all shrink-0 hover:bg-primary/20 border border-slate-100 group">
                            <ShoppingCart size={18} className="text-slate-600 group-hover:text-primary-dark transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-dark text-[10px] font-bold flex items-center justify-center text-white border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile search toggle */}
                        <button className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl shrink-0 hover:bg-white/5" onClick={() => setSearchOpen(!searchOpen)}>
                            <Search size={18} style={{ color: "var(--text-secondary)" }} />
                        </button>

                        {/* User menu — desktop */}
                        <div className="hidden md:block relative" ref={userMenuRef}>
                            {session ? (
                                <>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:bg-primary/10"
                                        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center border border-slate-100">
                                            <User size={12} className="text-slate-900" />
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{firstName}</span>
                                        <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }} />
                                    </button>
                                    {userMenuOpen && (
                                        <div className="absolute right-0 top-12 w-52 rounded-2xl overflow-hidden z-50 shadow-2xl animate-fade-in" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                                            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                                                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{session.user?.name}</div>
                                                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{session.user?.email}</div>
                                                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: role === "ADMIN" ? "rgba(255,107,0,0.12)" : "rgba(0,102,204,0.12)", color: role === "ADMIN" ? "var(--accent)" : "var(--primary-light)" }}>
                                                    {role}
                                                </span>
                                            </div>
                                            <div className="py-1">
                                    {role === "CUSTOMER" && (
                                        <Link 
                                            href="/vendor/register" 
                                            onClick={() => setUserMenuOpen(false)} 
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-primary/20" 
                                            style={{ color: "var(--primary-dark)" }}
                                        >
                                            <Store size={14} />Become a Vendor
                                        </Link>
                                    )}
                                    {role === "VENDOR" && (
                                        <a 
                                            href={process.env.NEXT_PUBLIC_VENDOR_URL + "/dashboard"} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onClick={() => setUserMenuOpen(false)} 
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-primary/20" 
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            <LayoutDashboard size={14} />Vendor Dashboard <ExternalLink size={12} className="ml-auto opacity-50" />
                                        </a>
                                    )}
                                    {role === "ADMIN" && (
                                        <a 
                                            href={process.env.NEXT_PUBLIC_ADMIN_URL} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            onClick={() => setUserMenuOpen(false)} 
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-primary/20" 
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            <Settings size={14} />Admin Panel <ExternalLink size={12} className="ml-auto opacity-50" />
                                        </a>
                                    )}
                                                <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-primary/20" style={{ color: "var(--text-secondary)" }}><LayoutDashboard size={14} />User Dashboard</Link>
                                                <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-primary/20" style={{ color: "var(--text-secondary)" }}><User size={14} />Profile Settings</Link>
                                                <Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-primary/20" style={{ color: "var(--text-secondary)" }}><Heart size={14} />My Wishlist</Link>
                                                <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-primary/20" style={{ color: "var(--text-secondary)" }}><ShoppingBag size={14} />My Orders</Link>
                                            </div>
                                            <div className="border-t py-1" style={{ borderColor: "var(--border)" }}>
                                                <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-red-900/15" style={{ color: "#EF4444" }}>
                                                    <LogOut size={14} />Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/vendor/register" className="hidden lg:block text-xs font-bold uppercase tracking-widest text-primary-dark hover:text-slate-900 transition-colors mr-2">Join as Vendor</Link>
                                    <Link href="/login" className="btn-ghost text-sm px-3 py-2">Login</Link>
                                    <Link href="/register" className="btn-primary text-sm px-4 py-2">Register</Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>

                    {/* Mobile search bar */}
                    {searchOpen && (
                        <div className="md:hidden pb-3 animate-fade-in">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                                <input autoFocus type="text" placeholder="Search parts, brands, vehicles from here" className="input-field pl-9 py-2.5 text-sm" />
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile drawer overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    {/* Drawer */}
                    <div className="absolute top-0 right-0 bottom-0 w-72 animate-slide-in-right flex flex-col" style={{ background: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center border border-slate-100">
                                    <Car size={14} className="text-slate-900" />
                                </div>
                                <span className="font-bold text-slate-900 text-sm">PHAMON</span>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>
                                <X size={16} />
                            </button>
                        </div>

                        {/* User info */}
                        {session && (
                            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-slate-100">
                                        <User size={18} className="text-slate-900" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{session.user?.name}</div>
                                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{role}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Nav Links */}
                        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
                            {navLinks.map(l => (
                                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all" style={{ color: "var(--text-secondary)" }}>
                                    {l.label}
                                </Link>
                            ))}
                            <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                <ShoppingCart size={16} /> Cart
                            </Link>
                            {session && (
                                <>
                                    <div className="h-px my-2" style={{ background: "var(--border)" }} />
                                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                        <LayoutDashboard size={16} /> User Dashboard
                                    </Link>
                                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                        <User size={16} /> Profile Settings
                                    </Link>
                                    <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                        <Heart size={16} /> My Wishlist
                                    </Link>
                                    <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                        <ShoppingBag size={16} /> My Orders
                                    </Link>
                                    {role === "CUSTOMER" && (
                                        <Link href="/vendor/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold" style={{ color: "var(--primary-dark)" }}>
                                            <Store size={16} /> Become a Vendor
                                        </Link>
                                    )}
                                    {role === "VENDOR" && <a href={process.env.NEXT_PUBLIC_VENDOR_URL + "/dashboard"} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)" }}><LayoutDashboard size={16} />Vendor Dashboard</a>}
                                    {role === "ADMIN" && <a href={process.env.NEXT_PUBLIC_ADMIN_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)" }}><Settings size={16} />Admin Panel</a>}
                                </>
                            )}
                            {!session && (
                                <>
                                    <div className="h-px my-2" style={{ background: "var(--border)" }} />
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Login</Link>
                                    <Link href="/vendor/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold" style={{ color: "var(--primary-dark)" }}>Join as Vendor</Link>
                                    <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Register Free</Link>
                                </>
                            )}
                        </div>

                        {/* Sign out */}
                        {session && (
                            <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
                                <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                                    <LogOut size={15} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
