import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import Vendor from "@/lib/models/Vendor";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { Search, Filter, Edit, Eye, MoreVertical, Plus } from "lucide-react";

export default async function ProductsPage() {
    await dbConnect();
    const products = await Product.find().populate('vendorId').sort({ createdAt: -1 });

    return (
        <div className="admin-main-container space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="heading-lg text-slate-900 font-bold text-2xl">Product Management</h1>
                    <p className="text-sm text-slate-500">Track and manage store inventory.</p>
                </div>
                <Link href="/products/add" className="bg-primary hover:bg-primary-hover text-slate-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors active:scale-95 shrink-0">
                    <Plus size={18} />
                    Add New Product
                </Link>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                    <div className="relative w-full max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search products..." className="input-field pl-10 !py-2 text-sm" />
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="desktop-table-view overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold">Vendor</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold">Stock</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl overflow-hidden">
                                                {product.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : "📦"}
                                            </div>
                                            <span className="font-medium text-slate-700">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {product.vendorId?.businessName || "Unknown Vendor"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{product.category}</td>
                                    <td className="px-6 py-4 text-slate-700 font-mono text-sm">UGX {product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm ${product.stock < 10 ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={product.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/products/${product._id}`} className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:text-primary-dark hover:bg-primary/20 transition-colors inline-flex">
                                            <Edit size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="mobile-card-view divide-y divide-slate-100">
                    {products.map((product) => (
                        <div key={product._id} className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl overflow-hidden border border-slate-100">
                                        {product.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : "📦"}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">{product.name}</div>
                                        <div className="text-[10px] text-slate-400">{product.vendorId?.businessName || "Unknown Vendor"}</div>
                                    </div>
                                </div>
                                <StatusBadge status={product.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="text-slate-400 mb-1 font-bold uppercase tracking-tighter">Price</div>
                                    <div className="text-slate-700 font-mono">UGX {product.price.toLocaleString()}</div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="text-slate-400 mb-1 font-bold uppercase tracking-tighter">Stock</div>
                                    <div className={`font-mono ${product.stock < 10 ? 'text-amber-600' : 'text-slate-700'}`}>{product.stock} units</div>
                                </div>
                            </div>

                            <Link href={`/products/${product._id}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-500 active:bg-slate-100">
                                <Edit size={14} /> Edit Details
                            </Link>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="p-12 text-center text-[#484F58] text-sm italic">
                        No products found in the database.
                    </div>
                )}
            </div>
        </div>
    );
}
