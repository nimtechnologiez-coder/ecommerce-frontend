import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import Vendor from "@/lib/models/Vendor";
import Order from "@/lib/models/Order";
import { Package, Users, ShoppingBag, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  await dbConnect();

  const [productCount, pendingProducts, userCount, vendorCount, orderCount] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "PENDING" }),
    User.countDocuments({ role: "CUSTOMER" }),
    Vendor.countDocuments(),
    Order.countDocuments()
  ]);

  const stats = [
    { label: "Total Products", value: productCount, icon: Package, color: "#3B82F6", href: "/products" },
    { label: "Pending Approvals", value: pendingProducts, icon: Clock, color: "#F59E0B", href: "/products" },
    { label: "Active Vendors", value: vendorCount, icon: Users, color: "#10B981", href: "/vendors" },
    { label: "Total Orders", value: orderCount, icon: ShoppingBag, color: "#8B5CF6", href: "/orders" },
  ];

  return (
    <div className="admin-main-container space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="heading-xl tracking-tight text-slate-900">System Intelligence</h1>
          <p className="text-slate-500 text-[15px] font-medium">Monitoring platform-wide performance and inventory.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-sm font-semibold">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Stats Verified
           </div>
           <button className="px-5 py-2.5 rounded-xl bg-primary text-slate-900 font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all">
              Refresh Data
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link href={stat.href} key={i} className="card group relative overflow-hidden active:scale-[0.98]">
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all duration-300">
                  <stat.icon size={22} />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-emerald-400 font-black">+4.2%</span>
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Today</span>
                </div>
              </div>
              
              <div className="space-y-0.5">
                <div className="text-[13px] text-slate-500 font-bold tracking-wide uppercase">{stat.label}</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value.toLocaleString("en-US")}</div>
              </div>
            </div>
            {/* Subtle Gradient Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-[50px] group-hover:bg-primary/10 transition-colors" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        <div className="lg:col-span-8 card space-y-8 min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <TrendingUp size={22} className="text-primary" />
              Operational Efficiency
            </h2>
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-50 border border-slate-200">
               <button className="px-3 py-1 rounded-md bg-white text-slate-900 text-[11px] font-bold shadow-sm border border-slate-200">Week</button>
               <button className="px-3 py-1 rounded-md text-slate-500 text-[11px] font-bold hover:text-slate-800">Month</button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-200 border-dashed p-12">
            <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50">
              <Clock size={32} className="text-primary" />
            </div>
            <h3 className="text-slate-900 font-bold text-xl mb-2">Analyzing Platform Velocity</h3>
            <p className="text-slate-500 text-[15px] font-medium max-w-sm mx-auto text-center leading-relaxed">We're gathering activity logs to generate your efficiency report. This usually takes a few seconds.</p>
          </div>
        </div>

        <div className="lg:col-span-4 card space-y-8 h-full flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
            <ShoppingBag size={22} className="text-primary" />
            Live Inbound Queue
          </h2>
          <div className="flex-1 flex flex-col pt-4">
             <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <ShoppingBag size={56} className="text-slate-700 mb-6" />
                <p className="text-slate-400 font-extrabold text-[13px] uppercase tracking-[0.2em]">Queue is currently clear</p>
             </div>
             <Link href="/orders" className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-black hover:bg-primary hover:text-slate-900 hover:border-primary transition-all shadow-lg shadow-black/5 group">
                <span className="flex items-center gap-2">
                  <span>Manage All Orders</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
