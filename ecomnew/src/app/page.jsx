"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WishlistButton from "@/components/shared/WishlistButton";
import { Car, Shield, Zap, Star, ChevronRight, ChevronLeft, ArrowRight, Package, Wrench, Battery, Settings, Search, Wallet, ArrowLeftRight } from "lucide-react";

const categories = [
  { name: "Engine Parts", icon: "⚙️", href: "/products?category=Engine Parts", color: "#0066CC" },
  { name: "Body & Exterior", icon: "🚗", href: "/products?category=Body & Exterior", color: "#FF6B00" },
  { name: "Electrical", icon: "⚡", href: "/products?category=Electrical", color: "#FFD700" },
  { name: "Brakes", icon: "🛑", href: "/products?category=Brakes", color: "#EF4444" },
  { name: "Tires & Wheels", icon: "🔄", href: "/products?category=Tires & Wheels", color: "#00B341" },
  { name: "Accessories", icon: "🔧", href: "/products?category=Accessories", color: "#8B5CF6" },
  { name: "Suspension", icon: "🔩", href: "/products?category=Suspension", color: "#F59E0B" },
  { name: "Lubricants", icon: "💧", href: "/products?category=Lubricants", color: "#6366F1" },
];

export default function HomePage() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products?limit=6");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const buyNow = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${productId}?buyNow=true`);
  };

  return (
    <div style={{ background: "var(--bg-dark)" }}>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-24 px-4 pt-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px] animate-pulse delay-700" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 0%, var(--bg-dark) 80%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-dark to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-bold mb-8 glass-effect hover:border-blue-500/30 transition-all group cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="gradient-text tracking-wide">TRUSTED BY 50,000+ UGANDAN MOTORISTS</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
            <span className="text-slate-900 block">REVOLUTIONIZE YOUR</span>
            <span className="gradient-text italic">DRIVING EXPERIENCE</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Uganda's elite marketplace for genuine automotive excellence.
            Source high-performance parts with unparalleled security.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href="/products" className="btn-primary text-lg h-16 px-10">
              EXPLORE COLLECTION <ArrowRight size={20} />
            </Link>
            <Link href="/vendor/register" className="btn-outline text-lg h-16 px-10">
              JOIN AS VENDOR
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "GENUINE PARTS", value: "10K+" },
              { label: "VERIFIED VENDORS", value: "250+" },
              { label: "ORDERS DELIVERED", value: "45K+" },
              { label: "AVERAGE RATING", value: "4.9/5" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="text-3xl font-black text-slate-900">{s.value}</span>
                <span className="text-[10px] font-bold tracking-widest text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH OVERLAY BAR */}
      <section className="px-4 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto glass-card p-2 flex items-center shadow-2xl">
          <div className="flex-1 flex items-center px-4 gap-4">
            <Search size={22} className="text-primary-dark" />
            <input
              type="text"
              placeholder="Start searching for part names, brands, or car models..."
              className="w-full bg-transparent border-none outline-none text-slate-900 font-medium py-4 placeholder:text-slate-400"
            />
          </div>
          <button className="btn-primary h-14 px-8 rounded-xl shrink-0">FIND PARTS</button>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-primary-dark font-bold mb-2 tracking-[0.3em] text-xs uppercase">Curated Selection</div>
              <h2 className="text-4xl font-black text-slate-900">SHOP BY CATEGORY</h2>
            </div>
            <Link href="/products" className="btn-ghost group text-slate-500">
              VIEW ALL CATEGORIES <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group relative h-48 rounded-2xl overflow-hidden glass-card p-6 flex flex-col justify-end hover:-translate-y-2 transition-all">
                <div className="absolute top-6 right-6 text-4xl opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500">
                  {cat.icon}
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{cat.name}</h3>
                  <div className="w-8 h-1 bg-primary-dark group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-24 px-4 pb-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <div className="text-orange-500 font-bold mb-2 tracking-[0.3em] text-xs uppercase">Hot This Month</div>
              <h2 className="text-4xl font-black text-slate-900">FEATURED DEALS</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all text-slate-400"><ChevronLeft /></button>
              <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all text-slate-400"><ChevronRight /></button>
            </div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center py-20">
               <div className="spinner w-10 h-10" />
             </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 italic">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id} onClick={() => router.push(`/products/${product._id}`)} className="product-card group bg-white shadow-xl shadow-slate-200/50 p-5 cursor-pointer">
                  {/* Visual Area */}
                  <div className="h-56 rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-slate-50 to-slate-100 mb-6 group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <span className="text-8xl group-hover:scale-110 transition-transform duration-700">{product.emoji || "⚙️"}</span>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-bold text-emerald-600 border border-emerald-500/20 shadow-sm">
                        INSTOCK • {product.stock}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <WishlistButton productId={product._id} />
                    </div>
                  </div>

                  {/* Information */}
                  <div className="px-2">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-[10px] font-black tracking-widest text-primary-dark mb-1 uppercase">{product.category}</div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary-dark transition-colors">{product.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1 text-orange-400 text-sm font-bold">
                        <Star size={14} fill="currentColor" /> {product.rating || 4.5}
                      </div>
                      <div className="text-zinc-500 text-xs font-medium">({product.reviews || 0} Verification Reviews)</div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Premium Price</div>
                        <div className="text-2xl font-black text-slate-900">UGX {Number(product.price).toLocaleString()}</div>
                      </div>
                      <button onClick={(e) => buyNow(product._id, e)} className="btn-primary h-12 rounded-xl group-hover:glow-primary relative z-10">BUY NOW</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PREMIUM CTA BANNER */}
      <section className="px-4 pb-32 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden group border border-slate-200 shadow-2xl" style={{ background: "linear-gradient(135deg, #F0FFFD 0%, #FFFFFF 100%)" }}>
            {/* Animated Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/40 rounded-full blur-[100px] group-hover:bg-primary/60 transition-all duration-700" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-500/5 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-dark text-xs font-black tracking-widest mb-6 border border-primary/30 uppercase">
                  Vendor Network
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                  MONETIZE YOUR<br />
                  <span className="gradient-text italic">AUTO INVENTORY</span>
                </h2>
                <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                  Connect with the largest network of automotive buyers in Uganda.
                  Professional tools, secure payouts, and global-scale reach.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link href="/vendor/register" className="btn-accent h-16 px-10 text-lg">
                    START SELLING NOW <ArrowRight size={20} />
                  </Link>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-bold ml-4">
                    <Shield className="text-primary-dark" size={18} /> TRUSTED BY 250+ VENDORS
                  </div>
                </div>
              </div>

              {/* Feature grid in CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                {[
                  { icon: <Zap className="text-primary-dark" />, label: "Instant Setup", desc: "Live in < 24hrs" },
                  { icon: <Wallet className="text-orange-500" />, label: "Daily Payouts", desc: "MTN/Airtel" },
                  { icon: <Package className="text-purple-500" />, label: "Bulk Upload", desc: "CSV Support" },
                  { icon: <ArrowLeftRight className="text-green-500" />, label: "ADR Trade", desc: "Zero Risk" },
                ].map((f) => (
                  <div key={f.label} className="glass-card p-6 flex flex-col gap-2 hover:bg-primary/5 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-2">{f.icon}</div>
                    <div className="font-bold text-slate-900 text-sm">{f.label}</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
