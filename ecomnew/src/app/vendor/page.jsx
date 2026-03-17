"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Car, Store, ArrowRight, ShieldCheck, BarChart3, Globe, Zap, LayoutDashboard, LogIn } from "lucide-react";

export default function VendorLandingPage() {
    const { data: session } = useSession();
    const role = session?.user?.role;

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-28">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark font-bold text-xs uppercase tracking-widest mb-8 animate-fade-in">
                            <Store size={14} /> Phamon Vendor Portal
                        </div>
                        
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight animate-slide-up">
                            Scale Your Automotive <br />
                            <span className="text-primary-dark">Business Globally.</span>
                        </h1>
                        
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up delay-100">
                            Join Uganda's most elite marketplace for genuine automotive parts. 
                            List your products, manage orders, and reach thousands of verified buyers instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
                            {role === "VENDOR" ? (
                                <a 
                                    href={process.env.NEXT_PUBLIC_VENDOR_URL + "/dashboard"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary px-8 py-4 text-base flex items-center gap-2 group shadow-xl shadow-primary/20"
                                >
                                    <LayoutDashboard size={20} />
                                    Open My Dashboard
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </a>
                            ) : (
                                <>
                                    <Link 
                                        href="/vendor/register" 
                                        className="btn-primary px-8 py-4 text-base flex items-center gap-2 group shadow-xl shadow-primary/20"
                                    >
                                        Join as a Vendor
                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link 
                                        href="/vendor/login" 
                                        className="btn-ghost px-8 py-4 text-base flex items-center gap-2 border border-slate-200 hover:bg-slate-50 transition-all"
                                    >
                                        <LogIn size={20} />
                                        Vendor Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Globe className="text-primary-dark" />,
                                    title: "Massive Reach",
                                    desc: "Access verified buyers across Uganda and East Africa looking for genuine parts."
                                },
                                {
                                    icon: <ShieldCheck className="text-primary-dark" />,
                                    title: "Secure Payments",
                                    desc: "Automated escrow and instant wallet withdrawals via Mobile Money and Bank."
                                },
                                {
                                    icon: <Zap className="text-primary-dark" />,
                                    title: "Direct Logistics",
                                    desc: "Our delivery network handles the hard part while you focus on sales."
                                }
                            ].map((f, i) => (
                                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 transition-colors group-hover:bg-primary/20">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-20 relative overflow-hidden text-center text-white">
                            <div className="absolute inset-0 bg-primary/10 opacity-50 blur-[100px]" />
                            <div className="relative z-10">
                                <h2 className="text-3xl lg:text-5xl font-black mb-6">Ready to start selling?</h2>
                                <p className="text-slate-400 max-w-xl mx-auto mb-10 text-lg">
                                    It takes less than 5 minutes to setup your micro-store and list your first part.
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-6">
                                    <Link href="/vendor/register" className="btn-primary border-none px-10 py-5 text-base">Get Started Free</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
