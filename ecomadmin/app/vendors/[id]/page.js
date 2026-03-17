import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import VendorActions from "./VendorActions";
import { ChevronLeft, Building, Mail, Phone, Wallet, Calendar, ShieldCheck, ShieldAlert, FileText, CheckCircle, XCircle, ExternalLink } from "lucide-react";

export default async function VendorDetailPage({ params }) {
    const { id } = await params;
    await dbConnect();
    
    const vendor = await Vendor.findById(id).populate('userId');

    if (!vendor) {
        return (
            <div className="admin-main-container flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Building size={48} className="mb-4 opacity-20" />
                <p>Vendor not found</p>
                <Link href="/vendors" className="mt-4 text-primary text-sm font-bold">Back to Vendors</Link>
            </div>
        );
    }

    return (
        <div className="admin-main-container space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <Link href="/vendors" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors mb-2">
                        <ChevronLeft size={14} /> Back to Vendor Approvals
                    </Link>
                    <h1 className="heading-lg text-slate-900 font-bold text-2xl flex items-center gap-3">
                        {vendor.businessName}
                        <StatusBadge status={vendor.kycStatus} />
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Member since {new Date(vendor.createdAt).toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </div>
                <div className="flex shrink-0 w-80">
                    <VendorActions vendorId={vendor._id.toString()} currentStatus={vendor.kycStatus} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Business Financial Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card bg-slate-900 text-white border-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-white/10 text-primary">
                                    <Wallet size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Available Balance</span>
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight">UGX {vendor.walletBalance?.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-400 mt-2">Settled funds ready for withdrawal</div>
                        </div>
                        <div className="card bg-white border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                                    <Calendar size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pending Payouts</span>
                            </div>
                            <div className="text-3xl font-black font-mono tracking-tight text-slate-900">UGX {vendor.pendingBalance?.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-400 mt-2">Awaiting the 14-day clearance window</div>
                        </div>
                    </div>

                    {/* KYC Documents Section */}
                    <div className="card space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Legal Documentation</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">KYC Compliance Check</p>
                                </div>
                            </div>
                            <StatusBadge status={vendor.kycStatus} size="sm" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">National ID / Passport</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{vendor.kycDocs?.nationalId || "No ID Number"}</span>
                                        </div>
                                        {vendor.kycDocs?.nationalIdUrl ? (
                                            <a href={vendor.kycDocs.nationalIdUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                                View Document <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic">No file uploaded</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Business Registration</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{vendor.kycDocs?.businessReg || "No Reg Number"}</span>
                                        </div>
                                        {vendor.kycDocs?.businessRegUrl ? (
                                            <a href={vendor.kycDocs.businessRegUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                                View Document <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic">No file uploaded</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center space-y-2">
                                <ShieldCheck size={32} className="text-slate-200" />
                                <div className="text-xs text-slate-400 max-w-[180px]">All legal documents are securely stored and encrypted in our platform vault.</div>
                            </div>
                        </div>

                        {vendor.adminRemarks && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                <div className="flex items-center gap-2 text-amber-600 mb-1">
                                    <ShieldAlert size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Admin Internal Remarks</span>
                                </div>
                                <p className="text-xs text-amber-700 line-clamp-3">{vendor.adminRemarks}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Owner Info */}
                    <div className="card space-y-6 text-center pt-8">
                        <div className="relative inline-block mx-auto mb-4">
                            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                <Building size={32} className="text-slate-200" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-green-500 border-2 border-white shadow-sm">
                                <CheckCircle size={12} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{vendor.userId?.name || "Unlinked User"}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Primary Representative</p>
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t border-slate-100 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                    <Mail size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Address</div>
                                    <div className="text-sm font-bold text-slate-700 truncate">{vendor.userId?.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                    <Phone size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Contact Number</div>
                                    <div className="text-sm font-bold text-slate-700 font-mono">{vendor.kycDocs?.momoNumber || "No Phone Registered"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Placeholder */}
                    <div className="card bg-slate-50/50 border-slate-200 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Platform Performance</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Total Orders</span>
                                <span className="text-xs font-black text-slate-900 font-mono">24</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Reviews</span>
                                <span className="text-xs font-black text-slate-900 font-mono">4.8 / 5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Success Rate</span>
                                <span className="text-xs font-black text-green-600 font-mono">98%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
