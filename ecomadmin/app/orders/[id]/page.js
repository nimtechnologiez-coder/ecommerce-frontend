import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { ChevronLeft, User, MapPin, CreditCard, Package, Download } from "lucide-react";
import OrderStatusActions from "./OrderStatusActions";

export default async function OrderDetailPage({ params }) {
    const { id } = await params;
    await dbConnect();
    
    const order = await Order.findById(id).populate('userId');

    if (!order) {
        return (
            <div className="admin-main-container flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Package size={48} className="mb-4 opacity-20" />
                <p>Order not found</p>
                <Link href="/orders" className="mt-4 text-primary text-sm font-bold">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="admin-main-container space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/orders" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors mb-2">
                        <ChevronLeft size={14} /> Back to Orders
                    </Link>
                    <h1 className="heading-lg text-slate-900 font-bold text-2xl flex items-center gap-3">
                        Order #{order._id.toString().slice(-8).toUpperCase()}
                        <StatusBadge status={order.paymentStatus} />
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </div>
                <button className="btn-outline flex items-center gap-2 text-sm h-10 px-4">
                    <Download size={16} /> Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Grouped by Vendor */}
                    {order.vendorOrders?.map((vendorGroup, idx) => (
                        <div key={idx} className="card overflow-hidden">
                            <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package size={16} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Shipment {idx + 1}</span>
                                </div>
                                <StatusBadge status={vendorGroup.status} size="sm" />
                            </div>
                            <div className="p-6 divide-y divide-slate-100">
                                {vendorGroup.items?.map((item, i) => (
                                    <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package size={24} className="text-slate-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-slate-900 truncate">{item.name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">Quantity: {item.quantity}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-slate-900 font-mono">UGX {item.price.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-400">per unit</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-50/50 p-6 flex items-center justify-between border-t border-slate-100">
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Carrier Details</div>
                                    <div className="text-sm font-bold text-slate-700">{vendorGroup.courierName || "Local Dispatch"}</div>
                                </div>
                                {vendorGroup.trackingNumber && (
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tracking ID</div>
                                        <div className="text-sm font-mono font-bold text-primary">{vendorGroup.trackingNumber}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    {/* Order Status Actions - NEW */}
                    <OrderStatusActions 
                        orderId={order._id.toString()} 
                        currentPaymentStatus={order.paymentStatus}
                        currentDeliveryStatus={order.deliveryStatus}
                    />

                    {/* Customer Info */}
                    <div className="card space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <User size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Customer Info</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Account Details</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-1">Full Name</div>
                                <div className="text-sm font-bold text-slate-700">{order.deliveryAddress?.name || order.userId?.name || "Guest User"}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-1">Email Address</div>
                                <div className="text-sm font-bold text-slate-700 truncate">{order.userId?.email || "No email linked"}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-1">Phone Number</div>
                                <div className="text-sm font-bold text-slate-700 font-mono">{order.deliveryAddress?.phone || "N/A"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="card space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Delivery Point</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Shipping Location</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-bold text-slate-700">{order.deliveryAddress?.city}</div>
                            <div className="text-sm text-slate-500 leading-relaxed">{order.deliveryAddress?.address}</div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="card space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <CreditCard size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Payment Summary</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Transaction Overview</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400 font-bold">
                                <span>Subtotal</span>
                                <span className="font-mono text-slate-600">UGX {(order.total - (order.deliveryFee || 5000)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 font-bold">
                                <span>Delivery Fee</span>
                                <span className="font-mono text-slate-600">UGX {(order.deliveryFee || 5000).toLocaleString()}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Grand Total</span>
                                <span className="text-xl font-black text-slate-900 font-mono tracking-tight">UGX {order.total?.toLocaleString()}</span>
                            </div>
                        </div>
                        {order.paymentRef && (
                            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">M-Pesa Reference</div>
                                <div className="text-xs font-mono font-bold text-slate-700">{order.paymentRef}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
