"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Target, Users, Award, Car, CheckCircle } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            
            <main>
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden border-b border-slate-100">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
                    <div className="page-container relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-[10px] font-black uppercase tracking-widest mb-6">
                                    <Award size={12} /> Established 2024
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-6 uppercase">
                                    Redefining the <span className="text-primary-dark">Automotive</span> <br /> Standard in Uganda.
                                </h1>
                                <p className="text-lg text-slate-500 leading-relaxed font-medium">
                                    Phamon Automotives is not just a marketplace; we are a technology-driven ecosystem built to bring transparency, trust, and quality to East Africa's automotive landscape.
                                </p>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl">
                                    <img 
                                        src="/about-hero.png" 
                                        alt="Automotive Excellence"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="py-16 bg-slate-50 border-b border-slate-100">
                    <div className="page-container">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-card p-8 bg-white border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                                    <Target size={24} className="text-slate-900" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3 text-primary-dark">Our Mission</h2>
                                <p className="text-base text-slate-50 text-slate-500 leading-relaxed font-medium">
                                    To empower every vehicle owner in Uganda with seamless access to genuine spare parts, verified vehicles, and expert technical support through a secure, digital-first platform.
                                </p>
                            </div>
                            <div className="glass-card p-8 bg-white border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20">
                                    <Shield size={24} className="text-primary" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Our Vision</h2>
                                <p className="text-base text-slate-500 leading-relaxed font-medium">
                                    To become the most trusted automotive authority in Africa, where every transaction is backed by cryptographic security and human integrity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-16">
                    <div className="page-container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">Driven by Values</h2>
                            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Transparency", desc: "No hidden costs. No fake parts. Every listing is verified by Phamon experts.", icon: Users },
                                { title: "Security", desc: "Our platform uses bank-grade encryption for payments and Smart Trade (ADR) for high-value deals.", icon: Shield },
                                { title: "Premium Quality", desc: "We source directly from manufacturers and authorized distributors to ensure durability.", icon: Award }
                            ].map((v, i) => (
                                <div key={i} className="group p-6 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all hover:scale-[1.02] duration-500">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                                        <v.icon size={18} className="text-slate-400 group-hover:text-slate-900" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats / Proof */}
                <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full" />
                    <div className="page-container relative z-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { val: "5,000+", label: "Genuine Parts" },
                                { val: "100+", label: "Verified Vendors" },
                                { val: "10k+", label: "Happy Customers" },
                                { val: "24/7", label: "Expert Support" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tighter">{stat.val}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24">
                    <div className="page-container text-center">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">
                                Ready to experience the <br /> <span className="text-primary-dark">Future</span> of Automotive?
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="/products" className="btn-primary px-10 py-4 text-sm font-black uppercase tracking-widest">Explore Marketplace</a>
                                <a href="/vendor/register" className="border border-slate-200 hover:bg-slate-50 px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all">Become a Vendor</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
