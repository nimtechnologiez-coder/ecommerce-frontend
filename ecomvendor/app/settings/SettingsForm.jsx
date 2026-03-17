"use client";
import { useState } from "react";
import { updateVendorSettings } from "./actions";
import ImageUpload from "@/components/ImageUpload";
import { Save, Store } from "lucide-react";

export default function SettingsForm({ initialData }) {
    const [logo, setLogo] = useState(initialData?.storeLogo ? [initialData.storeLogo] : []);
    const [banner, setBanner] = useState(initialData?.storeBanner ? [initialData.storeBanner] : []);
    const [description, setDescription] = useState(initialData?.description || "");
    const [announcement, setAnnouncement] = useState(initialData?.storeAnnouncement || "");
    const [whatsapp, setWhatsapp] = useState(initialData?.socialLinks?.whatsapp || "");
    const [facebook, setFacebook] = useState(initialData?.socialLinks?.facebook || "");
    const [instagram, setInstagram] = useState(initialData?.socialLinks?.instagram || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        if (logo.length > 0) formData.append("storeLogo", logo[0]);
        if (banner.length > 0) formData.append("storeBanner", banner[0]);
        formData.append("description", description);
        formData.append("storeAnnouncement", announcement);
        formData.append("whatsapp", whatsapp);
        formData.append("facebook", facebook);
        formData.append("instagram", instagram);

        const res = await updateVendorSettings(formData);
        
        setLoading(false);
        if (res.error) {
            setMessage({ type: "error", text: res.error });
        } else {
            setMessage({ type: "success", text: "Store profile updated successfully!" });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card space-y-8 max-w-3xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                 <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <Store size={20} />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-slate-900">Store Defaults</h2>
                    <p className="text-[13px] text-slate-500">Provide defaults that define your dealership's identity.</p>
                 </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Store Logo Thumbnail (1:1 Ratio)</label>
                    <ImageUpload value={logo} onChange={(val) => setLogo(val.length > 0 ? [val[val.length - 1]] : [])} />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Store Banner Image (16:9 Ratio)</label>
                    <ImageUpload value={banner} onChange={(val) => setBanner(val.length > 0 ? [val[val.length - 1]] : [])} />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">About Your Store (Description)</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Welcome to our premium automotive dealership..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Store Announcement Banner (Optional)</label>
                    <textarea 
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        placeholder="Special holiday discount 20% off on all brakes!"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">This will appear as a prominent banner on your public storefront.</p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Social Media Integration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">WhatsApp Number</label>
                            <input 
                                type="text"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="+256..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Facebook URL</label>
                            <input 
                                type="text"
                                value={facebook}
                                onChange={(e) => setFacebook(e.target.value)}
                                placeholder="facebook.com/..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Instagram Username</label>
                            <input 
                                type="text"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="@yourstore"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                >
                    <Save size={18} />
                    {loading ? "Saving..." : "Save Store Profile"}
                </button>
            </div>
        </form>
    );
}
