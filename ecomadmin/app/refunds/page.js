import dbConnect from "@/lib/db";
import Return from "@/lib/models/Return";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import RefundActions from "./RefundActions";
import { RotateCcw, Package, User, Building2, Calendar, FileText } from "lucide-react";

export default async function RefundsPage() {
    await dbConnect();
    
    // Fetch all returns and populate related data
    const returns = await Return.find()
        .populate('userId', 'name email')
        .populate('orderId', 'total paymentStatus')
        .populate('vendorId', 'businessName')
        .sort({ createdAt: -1 });

    return (
        <div className="admin-main-container space-y-6">
            <div>
                <h1 className="heading-lg text-slate-900 font-bold text-2xl flex items-center gap-3">
                    <RotateCcw className="text-primary" /> Return Requests
                </h1>
                <p className="text-sm text-slate-500 mt-1">Manage user-submitted return and refund requests.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {returns.map((req) => (
                    <div key={req._id} className="card group hover:border-primary/30 transition-colors">
                        <div className="flex flex-col md:flex-row gap-6">
                            
                            {/* Request Details */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <Calendar size={12} />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Reason: {req.reason}
                                        </h3>
                                    </div>
                                    <StatusBadge status={req.status} />
                                </div>
                                
                                {req.comment && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 flex items-start gap-2">
                                        <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                        <p>"{req.comment}"</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                            <User size={14} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Customer</div>
                                            <div className="text-xs font-bold text-slate-700 truncate">{req.userId?.name || "Unknown"}</div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                            <Building2 size={14} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Vendor</div>
                                            <div className="text-xs font-bold text-slate-700 truncate">{req.vendorId?.businessName || "Unknown"}</div>
                                        </div>
                                    </div>
                                    <Link href={`/orders/${req.orderId?._id}`} className="p-3 rounded-xl border border-slate-100 flex items-center gap-3 hover:border-primary transition-colors hover:bg-slate-50">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                            <Package size={14} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Order Info</div>
                                            <div className="text-xs font-bold text-slate-700 truncate">UGX {req.orderId?.total?.toLocaleString()}</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="shrink-0 md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Status</div>
                                    <div className={`text-sm font-bold ${req.orderId?.paymentStatus === 'REFUNDED' ? 'text-green-500' : 'text-slate-700'}`}>
                                        {req.orderId?.paymentStatus || "UNKNOWN"}
                                    </div>
                                </div>
                                
                                <RefundActions returnId={req._id.toString()} currentStatus={req.status} />
                            </div>
                        </div>
                    </div>
                ))}

                {returns.length === 0 && (
                    <div className="card text-center py-20 text-slate-400">
                        <RotateCcw size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm italic">No return requests found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
