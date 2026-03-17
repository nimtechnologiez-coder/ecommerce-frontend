"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToStoreLogin() {
    const router = useRouter();
    
    useEffect(() => {
        const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
        window.location.href = storeUrl + "/vendor/login";
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#BFFCF6]/10">
            <div className="text-center">
                <div className="spinner w-8 h-8 mb-4 border-slate-900/10 border-t-slate-900 mx-auto" />
                <p className="text-sm font-bold text-slate-900">Redirecting to Secure Authenticator...</p>
            </div>
        </div>
    );
}
