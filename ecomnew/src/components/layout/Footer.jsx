import Link from "next/link";
import { Car, Mail, Phone, MapPin, ExternalLink, Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t relative overflow-hidden bg-white" style={{ borderColor: "var(--border-muted)" }}>
            {/* Ambient Background Glow */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/20 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-12 lg:col-span-5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl border border-slate-100">
                                <Car size={24} className="text-slate-900" />
                            </div>
                            <div>
                                <span className="font-black text-slate-900 text-2xl tracking-tighter leading-none block">PHAMON</span>
                                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary-dark">Automotives</span>
                            </div>
                        </div>
                        <p className="text-lg leading-relaxed max-w-md mb-8" style={{ color: "var(--text-secondary)" }}>
                            Revolutionizing Uganda's automotive landscape through transparency, security, and premium quality.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="glass-card px-5 py-3 flex items-center gap-3 hover:bg-primary/10 transition-all cursor-default bg-slate-50 border-slate-200">
                                <Shield className="text-primary-dark" size={18} />
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Security Status</div>
                                    <div className="text-xs font-bold text-slate-900">WEBHOOK VERIFIED</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-4 lg:col-span-2">
                        <h3 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">Marketplace</h3>
                        <ul className="space-y-4">
                            {[
                                { label: "Genuine Parts", href: "/products" },
                                { label: "Vendor Portal", href: "/vendor" },
                                { label: "Premium Brands", href: "/products?filter=brands" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm font-medium hover:text-primary-dark transition-colors" style={{ color: "var(--text-secondary)" }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-2">
                        <h3 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">Resources</h3>
                        <ul className="space-y-4">
                            {[
                                { label: "Track Your Order", href: "/orders" },
                                { label: "Return Policy", href: "/returns" },
                                { label: "Support Center", href: "/support" },
                                { label: "Mobile Money Guide", href: "/guide" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm font-medium hover:text-primary-dark transition-colors" style={{ color: "var(--text-secondary)" }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-3">
                        <h3 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">Contact Phamon</h3>
                        <div className="space-y-4 mb-8">
                            <a href="mailto:support@phamon.ug" className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-primary-dark/50 transition-all">
                                    <Mail size={14} className="text-slate-400 group-hover:text-primary-dark" />
                                </div>
                                <span className="text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">support@phamon.ug</span>
                            </a>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                                    <MapPin size={14} className="text-slate-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-500">Kampala Central, Uganda</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl glass-card flex items-center gap-3 border-primary/20 bg-primary/10">
                            <div className="text-2xl">🇺🇬</div>
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-primary-dark leading-none mb-1 uppercase">Proudly Ugandan</div>
                                <div className="text-xs font-bold text-slate-900">EST. 2024 KAMPALA</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        © 2024 PHAMON AUTOMOTIVES • UGANDA'S #1 ELITE MARKETPLACE
                    </div>
                    <div className="flex gap-8">
                        <Link href="/terms" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms</Link>
                        <Link href="/privacy" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Privacy</Link>
                        <Link href="/cookies" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
