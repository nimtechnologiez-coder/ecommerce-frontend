"use client";
import { useState, useRef } from "react";
import { X, Loader2, UploadCloud, Link } from "lucide-react";
import { uploadImageAction } from "@/lib/actions";

export default function ImageUpload({ value, onChange }) {
    const [loading, setLoading] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [mode, setMode] = useState("url"); // "url" or "upload"
    const fileInputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadImageAction(formData);
            if (result.url) {
                onChange([...value, result.url]);
            } else {
                alert(`Upload failed: ${result.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during upload.");
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleAddUrl = () => {
        const trimmed = urlInput.trim();
        if (!trimmed) return;
        if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            alert("Please enter a valid URL starting with http:// or https://");
            return;
        }
        onChange([...value, trimmed]);
        setUrlInput("");
    };

    const removeImage = (urlToRemove) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    return (
        <div className="space-y-4">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest px-1">Product Images</label>

            {/* Existing images */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {value.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                            <img src={url} alt="Product" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(url)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Mode switcher */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setMode("url")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "url" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >
                    <Link size={12} /> Paste URL
                </button>
                <button
                    type="button"
                    onClick={() => setMode("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "upload" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >
                    <UploadCloud size={12} /> Upload File
                </button>
            </div>

            {/* URL Mode */}
            {mode === "url" && (
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                        Add
                    </button>
                </div>
            )}

            {/* Upload Mode */}
            {mode === "upload" && (
                <>
                    {loading ? (
                        <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center gap-2 bg-slate-50">
                            <Loader2 size={20} className="text-blue-500 animate-spin" />
                            <span className="text-xs font-bold text-slate-400 uppercase">Uploading...</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-24 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                            <UploadCloud size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500 uppercase">Click to Upload File</span>
                        </button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        accept="image/*"
                        className="hidden"
                    />
                </>
            )}

            <p className="text-[10px] text-slate-400 italic">
                * Use &ldquo;Paste URL&rdquo; to add images from any public link (e.g. Google Drive, Imgur). Recommended size: 800x800px.
            </p>
        </div>
    );
}
