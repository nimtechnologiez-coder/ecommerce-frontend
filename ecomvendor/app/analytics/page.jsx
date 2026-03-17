"use client";
import { useState, useEffect } from "react";
import { 
    TrendingUp, 
    Users, 
    MousePointer2, 
    Target, 
    Calendar, 
    ChevronDown, 
    ArrowUpRight, 
    ArrowDownRight,
    BarChart3,
    Eye,
    ShoppingBag,
    HelpCircle,
    Sparkles
} from "lucide-react";

export default function PerformancePage() {
    const [timeRange, setTimeRange] = useState("Last 30 Days");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const overviewStats = [
        { label: "Total Page Views", value: "12,402", change: "+14.2%", isPositive: true, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Sessions", value: "3,890", change: "+8.1%", isPositive: true, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Product Clicks", value: "1,520", change: "-2.4%", isPositive: false, icon: MousePointer2, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Conversion Rate", value: "3.2%", change: "+0.5%", isPositive: true, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    const topProducts = [
        { name: "Honda Civic Engine Block v2", sales: 124, revenue: "UGX 31.0M", conversion: "4.8%", trend: "up" },
        { name: "Toyota Original Radiator 2023", sales: 86, revenue: "UGX 38.7M", conversion: "5.2%", trend: "up" },
        { name: "High-Performance Spark Plugs", sales: 245, revenue: "UGX 1.2M", conversion: "2.1%", trend: "down" },
        { name: "Synthetic Motor Oil (5L)", sales: 112, revenue: "UGX 4.5M", conversion: "3.5%", trend: "up" },
    ];

    if (!mounted) return null;

    return (
        <div className="p-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Performance Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Make data-driven decisions based on customer behavior.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Calendar size={14} /> {timeRange} <ChevronDown size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {overviewStats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon size={22} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {stat.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">{stat.label}</div>
                        <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder/Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sales vs Traffic</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Revenue Performance Over Time</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <button className="px-3 py-1.5 bg-white text-slate-900 text-[10px] font-black uppercase rounded-lg shadow-sm border border-slate-200">Revenue</button>
                            <button className="px-3 py-1.5 text-slate-400 text-[10px] font-black uppercase hover:text-slate-600">Views</button>
                        </div>
                    </div>
                    
                    {/* Mock Chart Area */}
                    <div className="h-64 flex items-end gap-2 px-2">
                        {[40, 60, 45, 90, 65, 80, 55, 75, 95, 70, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div 
                                    className="w-full bg-slate-100 group-hover:bg-[#BFFCF6] transition-all rounded-t-lg cursor-pointer" 
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        UGX {(h * 100000).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                    <Sparkles className="absolute -top-10 -right-10 text-white/5 w-48 h-48 group-hover:rotate-12 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-[#BFFCF6]/10 border border-[#BFFCF6]/20 rounded-2xl flex items-center justify-center text-[#BFFCF6] mb-6">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-2xl font-black mb-2 leading-tight uppercase tracking-tight">Smart Recommendations</h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">Generated by PHAMON AI based on your trending products and market gaps.</p>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="text-[10px] font-black text-[#BFFCF6] uppercase mb-1">Pricing Opportunity</div>
                                <p className="text-xs">Your Engine Blocks are priced 10% lower than average. Consider adjustment.</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="text-[10px] font-black text-blue-400 uppercase mb-1">Restock Alert</div>
                                <p className="text-xs">Toyota Radiators are trending. Increasing stock could boost sales by 20%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Top Performance Grid</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Information</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sales Vol.</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Impact</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conv. Rate</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {topProducts.map((product, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                                <ShoppingBag size={18} className="text-slate-400" />
                                            </div>
                                            <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{product.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center text-sm font-mono font-black text-slate-900">{product.sales}</td>
                                    <td className="px-8 py-6 text-sm font-mono font-black text-slate-900">{product.revenue}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full" 
                                                    style={{ width: `${parseFloat(product.conversion) * 10}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black text-slate-900">{product.conversion}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {product.trend === 'up' ? 'Increasing' : 'Decreasing'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
