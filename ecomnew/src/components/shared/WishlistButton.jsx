"use client";
import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WishlistButton({ productId, initialIsWished = false, onToggle }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isWished, setIsWished] = useState(initialIsWished);
    const [loading, setLoading] = useState(false);

    // Fetch initial status if we're authenticated
    useEffect(() => {
        if (status === "authenticated" && !initialIsWished) {
            const checkStatus = async () => {
                try {
                    const res = await fetch("/api/user/wishlist");
                    if (res.ok) {
                        const wishlist = await res.json();
                        if (Array.isArray(wishlist)) {
                            // Match against populated objects (p._id) or raw IDs (p)
                            const found = wishlist.some(p => {
                                if (!p) return false;
                                const id = typeof p === 'object' ? (p._id || p.id || p.toString()) : p;
                                return id.toString() === productId.toString();
                            });
                            setIsWished(found);
                        }
                    }
                } catch (err) {
                    console.error("Failed to check wishlist status:", err);
                }
            };
            checkStatus();
        }
    }, [status, productId, initialIsWished]);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (status !== "authenticated") {
            router.push(`/login?callbackUrl=${window.location.pathname}`);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/user/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (res.ok) {
                const data = await res.json();
                setIsWished(data.action === "added");
                if (onToggle) onToggle(data.action === "added");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to update wishlist");
            }
        } catch (err) {
            console.error("Wishlist toggle error:", err);
            alert("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={loading}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isWished 
                ? "bg-red-50 text-red-500 border border-red-100 shadow-sm" 
                : "bg-white/80 backdrop-blur-md text-slate-400 border border-slate-200 hover:text-red-500 hover:border-red-200 shadow-sm"
            }`}
            title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <Heart size={16} fill={isWished ? "currentColor" : "none"} />
            )}
        </button>
    );
}
