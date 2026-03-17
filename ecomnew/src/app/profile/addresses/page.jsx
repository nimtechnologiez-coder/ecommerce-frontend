"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Plus, Trash2, Home, Briefcase, CheckCircle2, Loader2, AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddressesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        isDefault: false
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/profile/addresses");
        } else if (status === "authenticated") {
            fetchAddresses();
        }
    }, [status]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/user/addresses");
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
            }
        } catch (err) {
            console.error("Failed to fetch addresses:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const updatedAddresses = await res.json();
                setAddresses(updatedAddresses);
                setShowForm(false);
                setFormData({ name: "", phone: "", address: "", city: "", isDefault: false });
            } else {
                const data = await res.json();
                setError(data.error || "Failed to add address.");
            }
        } catch (err) {
            setError("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    const deleteAddress = async (id) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        
        try {
            const res = await fetch(`/api/user/addresses?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                const updatedAddresses = await res.json();
                setAddresses(updatedAddresses);
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const setAsDefault = async (id) => {
        try {
            const res = await fetch("/api/user/addresses", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addressId: id, isDefault: true }),
            });
            if (res.ok) {
                const updatedAddresses = await res.json();
                setAddresses(updatedAddresses);
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    if (loading || status === "loading") {
        return (
            <div style={{ background: "var(--bg-dark)" }}>
                <Navbar />
                <div className="min-h-[70vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            
            <main className="page-container py-12">
                <div className="max-w-4xl mx-auto">
                    <Link href="/profile" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6">
                        <ChevronLeft size={16} /> BACK TO PROFILE
                    </Link>

                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 mb-2">Saved <span className="gradient-text italic">Addresses</span></h1>
                            <p className="text-slate-500">Manage your delivery locations for faster checkout.</p>
                        </div>
                        {!showForm && (
                            <button 
                                onClick={() => setShowForm(true)}
                                className="btn-primary h-12 px-6 flex items-center gap-2 rounded-xl"
                            >
                                <Plus size={18} /> ADD NEW
                            </button>
                        )}
                    </div>

                    {showForm && (
                        <form onSubmit={handleAddAddress} className="card p-8 mb-10 border-none shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">Add New Address</h3>
                            
                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 mb-6">
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Contact Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="input-field py-3.5"
                                        placeholder="e.g. Home Office"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        required 
                                        className="input-field py-3.5"
                                        placeholder="+256..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Full Address / Street</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="input-field py-3.5"
                                        placeholder="Plot / House No., Street Name"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">City / Region</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="input-field py-3.5"
                                        placeholder="Kampala"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-8">
                                <input 
                                    type="checkbox" 
                                    id="isDefault" 
                                    className="w-5 h-5 accent-primary"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                />
                                <label htmlFor="isDefault" className="text-sm font-bold text-slate-700">Set as default address</label>
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" disabled={saving} className="btn-primary h-14 flex-1 rounded-xl font-bold">
                                    {saving ? <Loader2 className="animate-spin mx-auto" /> : "SAVE ADDRESS"}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline h-14 px-8 rounded-xl font-bold">CANCEL</button>
                            </div>
                        </form>
                    )}

                    {addresses.length === 0 && !showForm ? (
                        <div className="card text-center py-20 border-none shadow-xl shadow-slate-200/50">
                            <MapPin size={48} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No saved addresses</h3>
                            <p className="text-slate-500">Add an address to make your next purchase faster.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addresses.map((addr) => (
                                <div key={addr._id} className={`card p-6 relative group transition-all ${addr.isDefault ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-slate-50'}`}>
                                    {addr.isDefault && (
                                        <div className="absolute top-4 right-4 text-emerald-600 flex items-center gap-1 text-[10px] font-black uppercase">
                                            <CheckCircle2 size={12} /> DEFAULT
                                        </div>
                                    )}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${addr.isDefault ? 'bg-primary text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{addr.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium">{addr.phone}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 mb-6">
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{addr.address}</p>
                                        <p className="text-slate-900 font-bold">{addr.city}</p>
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                                        {!addr.isDefault && (
                                            <button 
                                                onClick={() => setAsDefault(addr._id)}
                                                className="text-[10px] font-black text-primary-dark hover:underline uppercase tracking-widest"
                                            >
                                                Set Default
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteAddress(addr._id)}
                                            className="text-[10px] font-black text-red-500 hover:underline uppercase tracking-widest ml-auto"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
