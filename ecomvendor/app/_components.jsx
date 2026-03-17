"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Save, Send, Plus, Package, ShoppingBag, Wallet, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import StatusBadge from "@/components/StatusBadge";
import { useRouter } from "next/navigation";

// ─── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard() {
    const { data: session } = useSession();
    const stats = [
        { label: "Total Orders", value: "48", Icon: ShoppingBag, color: "#059669", bg: "rgba(5,150,105,0.1)" },
        { label: "Pending Orders", value: "7", Icon: Clock, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
        { label: "Wallet Balance", value: "UGX 1,240,000", Icon: Wallet, color: "#00B341", bg: "rgba(0,179,65,0.1)" },
        { label: "Total Products", value: "23", Icon: Package, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
    ];
    const recentOrders = [
        { id: "A1B2C3D4", date: "Mar 9, 2024", amount: "UGX 120,000", status: "PENDING" },
        { id: "E5F6G7H8", date: "Mar 8, 2024", amount: "UGX 45,000", status: "PACKED" },
        { id: "I9J0K1L2", date: "Mar 7, 2024", amount: "UGX 320,000", status: "SHIPPED" },
    ];
    const lowStock = [
        { name: "Honda Brake Pads", stock: 2, category: "Brakes" },
        { name: "Toyota Oil Filter", stock: 4, category: "Engine" },
        { name: "LED Headlight H4", stock: 3, category: "Electrical" },
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Vendor Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Welcome back, {session?.user?.name}! Here&apos;s your store overview.</p>
                </div>
                <Link href="/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold hover:bg-[#A5F0E8] transition-colors">
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map(({ label, value, Icon, color, bg }) => (
                    <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                                <Icon size={20} style={{ color }} />
                            </div>
                            <TrendingUp size={14} className="text-green-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 mb-1">{value}</div>
                        <div className="text-xs text-slate-400">{label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900">Recent Orders</h2>
                        <Link href="/orders" className="text-xs text-blue-600 hover:underline">View all →</Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-900">#{order.id}</div>
                                    <div className="text-xs text-slate-400">{order.date}</div>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{order.amount}</span>
                                <StatusBadge status={order.status} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={18} className="text-amber-500" />
                        <h2 className="font-bold text-slate-900">Low Stock Alerts</h2>
                    </div>
                    <div className="space-y-3 mb-6">
                        {lowStock.map((item) => (
                            <div key={item.name} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs text-slate-400">{item.category}</span>
                                    <span className="text-xs font-bold text-amber-600">Only {item.stock} left</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                        <h3 className="font-bold text-sm text-slate-900 mb-3">Quick Links</h3>
                        <div className="space-y-1">
                            {[
                                { label: "Add New Product", href: "/products/new" },
                                { label: "View My Products", href: "/products" },
                                { label: "Manage Orders", href: "/orders" },
                                { label: "Check Wallet", href: "/wallet" },
                            ].map(link => (
                                <Link key={link.href} href={link.href} className="block text-sm py-1.5 text-slate-500 hover:text-slate-900 transition-colors">
                                    → {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Products List ───────────────────────────────────────────────────────────
function ProductsList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchProducts() {
            if (!session?.user?.id) return;
            try {
                const res = await fetch(`/api/products?vendorId=${session.user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || []);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [session]);

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">My Products</h1>
                    <p className="text-sm text-slate-500 mt-1">{products.length} products in your store</p>
                </div>
                <Link href="/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold hover:bg-[#A5F0E8] transition-colors">
                    <Plus size={16} /> Add Product
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl text-center py-20">
                    <Package size={48} className="mx-auto mb-4 text-slate-200" />
                    <h3 className="font-semibold text-slate-900">No products yet</h3>
                    <p className="text-sm mt-1 mb-4 text-slate-400">Add your first product to start selling.</p>
                    <Link href="/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold">Add First Product</Link>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg">⚙️</div>
                                            <span className="font-medium text-slate-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{product.category}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-900">UGX {product.price?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${product.stock === 0 ? "text-red-500" : product.stock < 5 ? "text-amber-500" : "text-slate-700"}`}>
                                            {product.stock === 0 ? "Out of Stock" : product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={product.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ─── Add Product ─────────────────────────────────────────────────────────────
const CATEGORIES = ["Engine Parts", "Body & Exterior", "Electrical", "Brakes", "Tires & Wheels", "Accessories", "Suspension", "Lubricants"];
const BRANDS = ["Toyota", "Honda", "Mitsubishi", "Nissan", "Subaru", "Universal", "Other"];

function AddProduct() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", category: "", brand: "", compatibility: "", description: "", price: "", stock: "", images: [] });
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e, isDraft = false) => {
        e.preventDefault();
        setError("");
        if (isDraft) setSavingDraft(true); else setLoading(true);
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    price: parseInt(form.price) || 0,
                    stock: parseInt(form.stock) || 0,
                    status: isDraft ? "DRAFT" : "PENDING",
                    images: form.images,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                router.push("/products");
            } else {
                setError(data.error || "Failed to save product. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
        } finally {
            setSavingDraft(false);
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6">
                <Link href="/products" className="text-sm text-slate-400 hover:text-slate-600">← Back to My Products</Link>
                <h1 className="text-2xl font-black text-slate-900 mt-2">Add New Product</h1>
                <p className="text-sm text-slate-500">Fill in the details. Products require admin approval before going live.</p>
            </div>

            {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

            <form onSubmit={(e) => handleSubmit(e, false)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Basic Info */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                            <h2 className="font-bold text-slate-900">Basic Info</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Product Name *</label>
                                <input required type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFFCF6]" placeholder="e.g. Toyota Camry Oil Filter OEM" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Category *</label>
                                    <select required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        <option value="">Select category</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Brand *</label>
                                    <select required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
                                        <option value="">Select brand</option>
                                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle Compatibility</label>
                                <input type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="e.g. Toyota Camry 2010-2022" value={form.compatibility} onChange={e => setForm({ ...form, compatibility: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                <textarea rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none" placeholder="Describe the product, features and specifications..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <h2 className="font-bold text-slate-900 mb-4">Pricing & Stock</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Price (UGX) *</label>
                                    <input required type="number" min="0" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="e.g. 45000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Stock Quantity *</label>
                                    <input required type="number" min="0" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none" placeholder="e.g. 50" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Images + Actions */}
                    <div className="space-y-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <ImageUpload value={form.images} onChange={(urls) => setForm({ ...form, images: urls })} />
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <h2 className="font-bold text-slate-900 mb-3">Submit</h2>
                            <div className="p-3 rounded-xl mb-4 text-xs bg-amber-50 border border-amber-200 text-amber-700">
                                ⏳ Products require admin approval before going live.
                            </div>
                            <div className="space-y-2">
                                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#BFFCF6] text-slate-900 rounded-xl text-sm font-bold hover:bg-[#A5F0E8] transition-colors disabled:opacity-60">
                                    {loading ? "Submitting..." : <><Send size={15} /> Submit for Approval</>}
                                </button>
                                <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={savingDraft} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-60">
                                    {savingDraft ? "Saving..." : <><Save size={15} /> Save as Draft</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export { Dashboard, ProductsList, AddProduct };
