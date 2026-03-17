"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";
import WishlistButton from "@/components/shared/WishlistButton";
import { Filter, Search, ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const CATEGORIES = ["All", "Engine Parts", "Body & Exterior", "Electrical", "Brakes", "Tires & Wheels", "Accessories", "Suspension", "Lubricants"];
const BRANDS = ["All", "Toyota", "Honda", "Mitsubishi", "Nissan", "Subaru", "Universal"];



export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(searchParams.get("category") || "All");
    const [brand, setBrand] = useState("All");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const perPage = 9;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const params = new URLSearchParams();
            if (category !== "All") params.append("category", category);
            if (brand !== "All") params.append("brand", brand);
            if (search) params.append("search", search);
            if (minPrice) params.append("minPrice", minPrice);
            if (maxPrice) params.append("maxPrice", maxPrice);
            params.append("page", page.toString());
            params.append("limit", perPage.toString());

            try {
                const res = await fetch(`/api/products?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || []);
                    setTotalPages(data.totalPages || 1);
                    setTotalResults(data.total || 0);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
            setLoading(false);
        };

        const timeoutId = setTimeout(fetchProducts, 400); // Debounce
        return () => clearTimeout(timeoutId);
    }, [category, brand, search, minPrice, maxPrice, page]);

    const addToCart = async (productId, e) => {
        e.preventDefault();
        e.stopPropagation();
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: 1 }),
        });
        if (res.ok) alert("Added to cart");
        else if (res.status === 401) window.location.href = "/login";
        else {
            const data = await res.json();
            alert(data.error || "Failed to add to cart");
        }
    };

    return (
        <div className="bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="section-title">All Products</h1>
                    <p className="section-sub">{totalResults} product{totalResults !== 1 ? "s" : ""} found</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <div className="lg:w-64 shrink-0 space-y-4">
                        {/* Search */}
                        <div className="card p-4">
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Search</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="    Search products form here" className="input-field pl-8 py-2 text-sm" />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="card p-4">
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Category</label>
                            <div className="space-y-1">
                                {CATEGORIES.map((cat) => (
                                    <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                                        style={{ background: category === cat ? "var(--primary)" : "transparent", color: category === cat ? "var(--text-primary)" : "var(--text-secondary)", border: category === cat ? "1px solid var(--primary-dark)" : "1px solid transparent" }}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="card p-4">
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Brand</label>
                            <select className="select-field text-sm py-2" value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1); }}>
                                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        {/* Price */}
                        <div className="card p-4">
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Price (UGX)</label>
                            <div className="space-y-2">
                                <input type="number" placeholder="Min price" className="input-field py-2 text-sm" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
                                <input type="number" placeholder="Max price" className="input-field py-2 text-sm" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
                            </div>
                            <button onClick={() => { setMinPrice(""); setMaxPrice(""); setSearch(""); setCategory("All"); setBrand("All"); setPage(1); }}
                                className="btn-ghost w-full mt-3 text-xs text-center py-1.5">Clear Filters</button>
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="spinner w-10 h-10" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="card text-center py-20">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No products found</h3>
                                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {products.map((product) => (
                                    <div key={product._id} onClick={() => router.push(`/products/${product._id}`)} className="product-card group cursor-pointer p-5 bg-white shadow-md rounded-2xl border border-slate-100 transition-all hover:shadow-lg">
                                        <div className="h-40 rounded-xl flex items-center justify-center mb-4 relative" style={{ background: "var(--bg-elevated)" }}>
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <span className="text-5xl">{product.emoji || "📦"}</span>
                                            )}
                                            <div className="absolute top-2 left-2">
                                                <span className={`badge text-[10px] px-2 py-0.5 ${product.stock > 10 ? "badge-approved" : product.stock > 0 ? "badge-pending" : "badge-rejected"}`}>
                                                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                                                </span>
                                            </div>
                                            <div className="absolute top-2 right-2">
                                                <WishlistButton productId={product._id} />
                                            </div>
                                        </div>
                                        <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{product.category} • {product.brand}</div>
                                        <h3 className="font-semibold text-sm mb-3 line-clamp-2 group-hover:text-primary-dark transition-colors" style={{ color: "var(--text-primary)" }}>{product.name}</h3>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900">UGX {Number(product.price).toLocaleString()}</span>
                                                <button onClick={(e) => addToCart(product._id, e)} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1 relative z-10">
                                                    <ShoppingCart size={12} /> Add
                                                </button>
                                            </div>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                router.push(`/products/${product._id}?buyNow=true`);
                                            }} className="btn-primary w-full py-1.5 text-xs relative z-10">
                                                BUY NOW
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline py-2 px-3">
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button key={p} onClick={() => setPage(p)}
                                        className="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                                        style={{ background: page === p ? "var(--primary)" : "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
                                        {p}
                                    </button>
                                ))}
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline py-2 px-3">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
