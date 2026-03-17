import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { ChevronLeft, Package, Tag, Layers, Box, DollarSign, AlignLeft, Edit3 } from "lucide-react";
import ProductReviewActions from "./ProductReviewActions";
import EditProductForm from "./EditProductForm";
import Vendor from "@/lib/models/Vendor";
import User from "@/lib/models/User";

export default async function ProductDetailPage({ params, searchParams }) {
    const { id } = await params;
    const { edit } = await searchParams;
    const isEditing = edit === "true";

    await dbConnect();
    const [product, vendors] = await Promise.all([
        Product.findById(id).populate("vendorId").lean(),
        Vendor.find({}, "businessName").lean()
    ]);

    if (!product) {
        return (
            <div className="admin-main-container flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Package size={48} className="mb-4 opacity-20" />
                <p>Product not found</p>
                <Link href="/products" className="mt-4 text-primary text-sm font-bold">Back to Products</Link>
            </div>
        );
    }

    return (
        <div className="admin-main-container space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Link href="/products" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors mb-2">
                        <ChevronLeft size={14} /> Back to Products
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        {isEditing ? "Edit Product" : "Product Review"}
                        <StatusBadge status={product.status} />
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Submitted by <strong>{product.vendorId?.businessName || "Unknown Vendor"}</strong>
                    </p>
                </div>

                {!isEditing && (
                    <Link 
                        href={`/products/${id}?edit=true`}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                    >
                        <Edit3 size={16} /> Edit Product
                    </Link>
                )}
            </div>

            {isEditing ? (
                <EditProductForm 
                    product={JSON.parse(JSON.stringify(product))} 
                    vendors={JSON.parse(JSON.stringify(vendors))}
                    onCancel={`/products/${id}`}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Product Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Images */}
                    {product.images?.length > 0 && (
                        <div className="card">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Product Images</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {product.images.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                                        <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Core Details */}
                    <div className="card space-y-5">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Product Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Package size={15} className="text-primary" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Product Name</div>
                                    <div className="text-sm font-bold text-slate-900 mt-0.5">{product.name}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <Tag size={15} className="text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Brand</div>
                                    <div className="text-sm font-bold text-slate-900 mt-0.5">{product.brand || "—"}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                                    <Layers size={15} className="text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Category</div>
                                    <div className="text-sm font-bold text-slate-900 mt-0.5">{product.category}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                                    <Box size={15} className="text-amber-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stock</div>
                                    <div className={`text-sm font-bold mt-0.5 ${product.stock < 5 ? 'text-red-600' : 'text-slate-900'}`}>{product.stock} units</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                    <DollarSign size={15} className="text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Price</div>
                                    <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">UGX {product.price?.toLocaleString()}</div>
                                </div>
                            </div>
                            {product.compatibility && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                        <Layers size={15} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Compatibility</div>
                                        <div className="text-sm font-bold text-slate-900 mt-0.5">{product.compatibility}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="card space-y-3">
                            <div className="flex items-center gap-2">
                                <AlignLeft size={15} className="text-slate-400" />
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                        </div>
                    )}
                </div>

                {/* Right: Sidebar – Review Actions + Meta */}
                <div className="space-y-6">
                    {/* Approve / Reject panel */}
                    <ProductReviewActions
                        productId={product._id.toString()}
                        currentStatus={product.status}
                        currentRemarks={product.adminRemarks || ""}
                    />

                    {/* Vendor Info */}
                    <div className="card space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Vendor Info</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Business</div>
                                <div className="font-bold text-slate-900">{product.vendorId?.businessName || "—"}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Submitted On</div>
                                <div className="font-bold text-slate-700">{new Date(product.createdAt).toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Last Updated</div>
                                <div className="font-bold text-slate-700">{new Date(product.updatedAt).toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
