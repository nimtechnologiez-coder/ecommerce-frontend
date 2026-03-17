"use client";
import { useEffect, useState, use } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/shared/StatusBadge";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ChevronLeft, Package, Truck, CheckCircle2, RotateCcw, Download, Eye } from "lucide-react";

const timelineSteps = [
    { key: "placed", label: "Order Placed", icon: "📋" },
    { key: "paid", label: "Payment Confirmed", icon: "💳" },
    { key: "packed", label: "Packed", icon: "📦" },
    { key: "shipped", label: "Shipped", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "✅" },
];

export default function OrderDetailPage({ params }) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetchOrder();
        } else if (status === "unauthenticated") {
            window.location.href = `/login?callbackUrl=${encodeURIComponent(`/orders/${id}`)}`;
        }
    }, [status, id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else if (res.status === 401) {
                window.location.href = `/login?callbackUrl=${encodeURIComponent(`/orders/${id}`)}`;
            }
        } catch (err) {
            console.error("Order detail fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getTimelineStep = (paymentStatus, orderStatus) => {
        if (orderStatus === "DELIVERED") return 4;
        if (orderStatus === "SHIPPED") return 3;
        if (orderStatus === "PACKED") return 2;
        if (paymentStatus === "PAID") return 1;
        return 0;
    };

    if (loading) return <div style={{ background: "var(--bg-dark)" }}><Navbar /><div className="page-container flex justify-center items-center min-h-[60vh]"><div className="spinner w-8 h-8" /></div></div>;
    if (!order) return <div style={{ background: "var(--bg-dark)" }}><Navbar /><div className="page-container"><div className="card text-center py-20"><p style={{ color: "var(--text-muted)" }}>Order not found.</p></div></div></div>;

    const handleDownloadInvoice = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(33, 33, 33);
        doc.text("INVOICE", 105, 20, { align: "center" });

        // Order Info
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Order ID: #${order._id.slice(-8).toUpperCase()}`, 14, 40);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 46);
        doc.text(`Payment Status: ${order.paymentStatus}`, 14, 52);

        // Billing / Shipping Address
        doc.setFontSize(12);
        doc.setTextColor(33, 33, 33);
        doc.text("Billed To:", 140, 40);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(order.deliveryAddress?.name || "", 140, 46);
        doc.text(order.deliveryAddress?.phone || "", 140, 52);
        doc.text(order.deliveryAddress?.address || "", 140, 58);
        doc.text(order.deliveryAddress?.city || "", 140, 64);

        // Items Table
        const tableColumn = ["Item", "Vendor", "Quantity", "Price", "Total"];
        const tableRows = [];

        order.vendorOrders?.forEach(vo => {
            vo.items?.forEach(item => {
                const itemData = [
                    item.name,
                    vo.vendorName || "Vendor",
                    item.quantity.toString(),
                    `UGX ${item.price.toLocaleString()}`,
                    `UGX ${(item.price * item.quantity).toLocaleString()}`
                ];
                tableRows.push(itemData);
            });
        });

        autoTable(doc, {
            startY: 75,
            head: [tableColumn],
            body: tableRows,
            theme: "grid",
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        });

        // Totals
        const finalY = doc.lastAutoTable?.finalY || 75;
        doc.setFontSize(10);
        doc.setTextColor(33, 33, 33);
        doc.text(`Subtotal: UGX ${(order.total - (order.deliveryFee || 0)).toLocaleString()}`, 140, finalY + 10);
        doc.text(`Delivery Fee: UGX ${(order.deliveryFee || 0).toLocaleString()}`, 140, finalY + 16);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Total: UGX ${order.total.toLocaleString()}`, 140, finalY + 24);

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("Thank you for your business!", 105, finalY + 40, { align: "center" });

        doc.save(`Invoice_${order._id.slice(-8).toUpperCase()}.pdf`);
    };

    const currentStep = getTimelineStep(order.paymentStatus, order.vendorOrders?.[0]?.status || "PENDING");
    const vendorOrder = order.vendorOrders?.[0];

    return (
        <div style={{ background: "var(--bg-dark)" }}>
            <Navbar />
            <div className="page-container">
                <Link href="/orders" className="flex items-center gap-2 text-sm mb-6 hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>
                    <ChevronLeft size={16} /> Back to Orders
                </Link>
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                    <div>
                        <h1 className="section-title mb-1">Order #{order._id?.slice(-8).toUpperCase()}</h1>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Placed on {new Date(order.createdAt).toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <StatusBadge status={order.paymentStatus} />
                </div>

                {/* Timeline */}
                <div className="card mb-6">
                    <h3 className="font-bold mb-5" style={{ color: "var(--text-primary)" }}>Order Timeline</h3>
                    <div className="flex items-start gap-0">
                        {timelineSteps.map((step, i) => (
                            <div key={step.key} className="flex-1 flex flex-col items-center">
                                <div className="flex items-center w-full">
                                    {i > 0 && <div className="flex-1 h-0.5" style={{ background: i <= currentStep ? "var(--primary)" : "var(--border)" }} />}
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: i <= currentStep ? "rgba(0,102,204,0.2)" : "var(--bg-elevated)", border: `2px solid ${i <= currentStep ? "var(--primary)" : "var(--border)"}`, fontSize: i <= currentStep ? "1rem" : "0.7rem" }}>
                                        {i <= currentStep ? step.icon : i + 1}
                                    </div>
                                    {i < timelineSteps.length - 1 && <div className="flex-1 h-0.5" style={{ background: i < currentStep ? "var(--primary)" : "var(--border)" }} />}
                                </div>
                                <div className="mt-2 text-center">
                                    <div className="text-xs font-medium" style={{ color: i <= currentStep ? "var(--text-primary)" : "var(--text-muted)" }}>{step.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Vendor Shipments */}
                        {order.vendorOrders?.map((vendorOrder, vIdx) => (
                            <div key={vIdx} className="card overflow-hidden">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Package size={16} className="text-primary-dark" />
                                        </div>
                                        <h3 className="font-bold text-slate-900">Shipment from {vendorOrder.vendorName || "Vendor"}</h3>
                                    </div>
                                    <StatusBadge status={vendorOrder.status} size="sm" />
                                </div>
                                
                                <div className="space-y-4 mb-6">
                                    {vendorOrder.items?.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all shadow-sm shadow-slate-200/20">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xl bg-slate-50">⚙️</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-slate-900 truncate" title={item.name}>{item.name}</div>
                                                <div className="text-[11px] font-medium text-slate-500 mt-0.5">Quantity: {item.quantity} × UGX {item.price?.toLocaleString()}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-black text-primary-dark">UGX {(item.price * item.quantity)?.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tracking for this vendor */}
                                {vendorOrder.trackingNumber ? (
                                    <div className="p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-3 text-primary text-[10px] font-black uppercase tracking-widest">
                                                <Truck size={12} /> Live Tracking Information
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-slate-400 text-[10px] uppercase font-bold tracking-tight mb-1">Carrier</div>
                                                    <div className="text-sm font-bold">{vendorOrder.courierName || "Local Delivery"}</div>
                                                </div>
                                                <div>
                                                    <div className="text-slate-400 text-[10px] uppercase font-bold tracking-tight mb-1">Tracking Number</div>
                                                    <div className="text-sm font-mono font-bold text-primary">{vendorOrder.trackingNumber}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                                        <p className="text-xs text-slate-500">Tracking information will be available once the vendor ships your items.</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        <div className="card">
                            <h3 className="font-bold mb-4 text-slate-900">Payment Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-slate-700">UGX {(order.total - order.deliveryFee)?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Delivery Fee</span>
                                    <span className="text-slate-700">UGX {order.deliveryFee?.toLocaleString()}</span>
                                </div>
                                <div className="divider h-px bg-slate-100 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-slate-900 uppercase text-xs tracking-wider">Total Amount</span>
                                    <span className="text-xl font-black text-primary-dark tracking-tight">UGX {order.total?.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            {order.paymentMethod && (
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Paid Via</div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                                        <span className="text-xs font-bold text-slate-700">{order.paymentMethod}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <h3 className="font-bold mb-3" style={{ color: "var(--text-primary)" }}>Delivery Address</h3>
                            <div className="text-sm space-y-1" style={{ color: "var(--text-secondary)" }}>
                                <div style={{ color: "var(--text-primary)" }}>{order.deliveryAddress?.name}</div>
                                <div>{order.deliveryAddress?.phone}</div>
                                <div>{order.deliveryAddress?.address}</div>
                                <div>{order.deliveryAddress?.city}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button onClick={handleDownloadInvoice} className="btn-outline w-full flex items-center justify-center gap-2 text-sm">
                                <Download size={14} /> Download Invoice
                            </button>
                            {order.paymentStatus === "PAID" && (
                                <Link href={`/returns/${order._id}`} className="btn-ghost w-full text-center text-sm flex items-center justify-center gap-2">
                                    <RotateCcw size={14} /> Request Return
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
