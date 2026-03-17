"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

export default function PaymentStatusPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const method = searchParams.get("method") || "MOMO";
    const ref = searchParams.get("ref");
    const router = useRouter();

    const getMethodConfig = () => {
        switch(method) {
            case "UPI": 
            case "GPAY":
                return {
                    title: "Waiting for App Approval",
                    desc: "Please open your UPI/GPay app and approve the payment request.",
                    icon: "📲",
                    accent: "#00B341"
                };
            case "CARD":
                return {
                    title: "Processing Card Payment",
                    desc: "We are securely verifying your card details with your bank.",
                    icon: "💳",
                    accent: "var(--primary)"
                };
            case "MBANK":
                return {
                    title: "Redirecting to Bank",
                    desc: "Please wait while we establish a secure connection with your bank's portal.",
                    icon: "🏛️",
                    accent: "var(--accent)"
                };
            default:
                return {
                    title: "Waiting for Payment",
                    desc: "Please approve the payment request on your Mobile Money phone.",
                    icon: "📱",
                    accent: "#F59E0B"
                };
        }
    };

    const config = getMethodConfig();

    const [status, setStatus] = useState("PENDING");
    const [polling, setPolling] = useState(true);
    const [countdown, setCountdown] = useState(30);

    // Simulate polling
    useEffect(() => {
        if (!orderId) return;
        const interval = setInterval(async () => {
            setCountdown(c => c - 1);
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
                const order = await res.json();
                if (order.paymentStatus === "PAID") {
                    setStatus("PAID");     
                    setPolling(false);
                    clearInterval(interval);
                } else if (order.paymentStatus === "FAILED") {
                    setStatus("FAILED");
                    setPolling(false);
                    clearInterval(interval);
                }
            }
        }, 3000);
        const timeout = setTimeout(() => { clearInterval(interval); setPolling(false); }, 90000);
        return () => { clearInterval(interval); clearTimeout(timeout); };
    }, [orderId]);

    // Auto-confirm payment after 5 seconds for simulation
    useEffect(() => {
        if (status === "PENDING" && ref) {
            const timer = setTimeout(async () => {
                await simulateSuccess();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status, ref]);

    // Quick simulate webhook for demo
    const simulateSuccess = async () => {
        try {
            await fetch("/api/payments/webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentRef: ref, status: "SUCCESS" }),
            });
            setStatus("PAID");
            setPolling(false);
        } catch (err) {
            console.error("Auto-payment confirmation failed:", err);
        }
    };

    return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            <div className="page-container flex items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-md animate-fade-in">
                    {status === "PENDING" && (
                        <div className="card text-center">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${config.accent}1A`, border: `2px solid ${config.accent}4D` }}>
                                    <Clock size={36} style={{ color: config.accent }} />
                                </div>
                                <div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${config.accent}4D`, animation: "pulse-ring 2s ease-out infinite" }} />
                            </div>
                            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>{config.title}</h2>
                            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                                {config.desc} <br />
                                {ref && (
                                    <>Reference: <span className="font-mono font-semibold" style={{ color: config.accent }}>{ref}</span></>
                                )}
                            </p>
                            <div className="p-4 rounded-xl mb-6 text-sm flex items-center justify-center gap-2" style={{ background: `${config.accent}10`, border: `1px solid ${config.accent}33`, color: config.accent }}>
                                <span className="text-lg">{config.icon}</span> 
                                <span>Action required on your device</span>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Processing secure transaction...
                            </div>
                        </div>
                    )}

                    {status === "PAID" && (
                        <div className="card text-center">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(0,179,65,0.1)", border: "2px solid rgba(0,179,65,0.3)" }}>
                                <CheckCircle size={36} style={{ color: "#00B341" }} />
                            </div>
                            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Payment Successful 🎉</h2>
                            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Your order has been confirmed. You'll receive an SMS notification shortly.</p>
                            <div className="flex flex-col gap-2">
                                <Link href={`/orders/${orderId}`} className="btn-primary text-center">View Order Details</Link>
                                <Link href="/orders" className="btn-outline text-center text-sm">All Orders</Link>
                            </div>
                        </div>
                    )}

                    {status === "FAILED" && (
                        <div className="card text-center">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.3)" }}>
                                <XCircle size={36} style={{ color: "#EF4444" }} />
                            </div>
                            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Payment Failed</h2>
                            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>The payment was not completed. You can retry or contact support.</p>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => setStatus("PENDING")} className="btn-accent flex items-center justify-center gap-2">
                                    <RefreshCw size={16} /> Retry Payment
                                </button>
                                <Link href="/cart" className="btn-outline text-center text-sm">Back to Cart</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
