import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import User from "@/lib/models/User";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { UserCheck, Shield, Mail, Phone, Users, ChevronRight, Wallet } from "lucide-react";

export default async function VendorsPage() {
    await dbConnect();
    const vendors = await Vendor.find().populate('userId').sort({ createdAt: -1 });

    return (
        <div className="admin-main-container space-y-6">
            <div>
                <h1 className="heading-lg text-slate-900 font-bold text-2xl">Vendor Approvals</h1>
                <p className="text-sm text-slate-500">Verify and manage platform vendors.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {vendors.map((vendor) => (
                    <div key={vendor._id} className="card group hover:border-primary/30 overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/vendors/${vendor._id}`} className="text-xl font-bold text-slate-900 mb-1 hover:text-primary transition-colors block truncate">
                                            {vendor.businessName}
                                        </Link>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5 truncate"><Mail size={12} /> {vendor.userId?.email}</span>
                                            <span className="flex items-center gap-1.5"><Phone size={12} /> {vendor.userId?.phone || "No phone"}</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <StatusBadge status={vendor.kycStatus} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">Wallet</div>
                                        <div className="text-slate-700 font-mono text-sm truncate">UGX {vendor.walletBalance.toLocaleString()}</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">Pending</div>
                                        <div className="text-slate-700 font-mono text-sm truncate">UGX {vendor.pendingBalance.toLocaleString()}</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 md:col-span-1">
                                        <div className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">Joined On</div>
                                        <div className="text-slate-700 text-xs font-bold">{new Date(vendor.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 md:w-56 flex flex-col gap-2">
                                 <Link href={`/vendors/${vendor._id}`} className="px-4 py-2.5 rounded-xl bg-primary text-slate-900 text-xs font-bold flex items-center justify-center gap-2 w-full hover:bg-primary-hover active:scale-95 transition-all">
                                    <UserCheck size={14} /> Full Profile
                                 </Link>
                                 <Link href={`/vendors/${vendor._id}`} className="py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all text-xs font-bold flex items-center justify-center gap-2 active:scale-95">
                                    <Shield size={14} /> KYC Documents
                                 </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {vendors.length === 0 && (
                    <div className="card text-center py-20 text-slate-400">
                        <Users size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm italic">No platform vendors registered.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
