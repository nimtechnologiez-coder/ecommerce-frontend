"use client";
import { useState, useEffect } from "react";
import { 
    Package, 
    AlertTriangle, 
    Edit3, 
    RefreshCcw, 
    Search, 
    Filter, 
    ChevronRight,
    ArrowUpDown,
    CheckCircle2,
    Save,
    Trash2,
    Plus,
    X
} from "lucide-react";

export default function InventoryPage() {
    const [mounted, setMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [inventory, setInventory] = useState([
        { id: "1", name: "Honda Civic Engine Block v2", sku: "ENG-HC-V2", stock: 12, price: 250000, status: "Healthy" },
        { id: "2", name: "Toyota Original Radiator", sku: "RAD-TY-78", stock: 4, price: 450000, status: "Low" },
        { id: "3", name: "High-Perf Spark Plugs (8pk)", sku: "SPK-HP-08", stock: 2, price: 45000, status: "Critical" },
        { id: "4", name: "Synthetic Motor Oil (5L)", sku: "OIL-SY-5L", stock: 45, price: 125000, status: "Healthy" },
        { id: "5", name: "Brake Pads - Premium", sku: "BRK-PR-01", stock: 0, price: 85000, status: "Out of Stock" },
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleStockUpdate = (id, newStock) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const stock = parseInt(newStock) || 0;
                let status = "Healthy";
                if (stock <= 0) status = "Out of Stock";
                else if (stock <= 3) status = "Critical";
                else if (stock <= 10) status = "Low";
                return { ...item, stock, status };
            }
            return item;
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Inventory updated successfully!");
        }, 1000);
    };

    if (!mounted) return null;

    return (
        <div className="p-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Stock & Inventory</h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor stock levels and perform bulk updates instantly.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <RefreshCcw size={16} /> Sync Catalog
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>
            </div>

            {/* Inventory Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                        <AlertTriangle size={28} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-1">Critical Stock</div>
                        <div className="text-2xl font-black text-slate-900">{inventory.filter(i => i.stock <= 3).length} Items</div>
                    </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                        <Package size={28} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Low Inventory</div>
                        <div className="text-2xl font-black text-slate-900">{inventory.filter(i => i.stock > 3 && i.stock <= 10).length} Items</div>
                    </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Healthy Catalog</div>
                        <div className="text-2xl font-black text-slate-900">{inventory.filter(i => i.stock > 10).length} Items</div>
                    </div>
                </div>
            </div>

            {/* Main Inventory Table */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight text-nowrap">Stock Ledger</h3>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                            {["ALL", "CRITICAL", "LOW", "HEALTHY", "OUT OF STOCK"].map(s => (
                                <button key={s} className="px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border border-slate-200 text-slate-400 hover:border-slate-300 transition-all whitespace-nowrap">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by name or SKU..." 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product & SKU</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div>
                                            <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">{item.sku}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="number" 
                                                value={item.stock}
                                                onChange={(e) => handleStockUpdate(item.id, e.target.value)}
                                                className={`w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all ${item.stock <= 3 ? 'text-rose-600 border-rose-200 bg-rose-50' : 'text-slate-900'}`}
                                            />
                                            <span className="text-[10px] font-black text-slate-300 uppercase">UNITS</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-300">UGX</span>
                                            <input 
                                                type="text"
                                                defaultValue={item.price.toLocaleString()}
                                                className="w-28 px-0 bg-transparent border-none text-xs font-black text-slate-900 focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            item.status === "Healthy" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            item.status === "Low" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            "bg-rose-50 text-rose-600 border-rose-100"
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${
                                                item.status === "Healthy" ? "bg-emerald-500" :
                                                item.status === "Low" ? "bg-amber-500" :
                                                "bg-rose-500"
                                            }`} />
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {inventory.length} active catalog items</p>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 disabled:opacity-50" disabled>1</button>
                        <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight size={14} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
