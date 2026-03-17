"use client";
import { useState, useEffect } from "react";
import { Upload, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

export default function VendorKYCPage() {
    const [docs, setDocs] = useState({ 
        nationalId: "", 
        businessReg: "", 
        momoNumber: "",
        nationalIdUrl: "",
        businessRegUrl: ""
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [kycStatus, setKycStatus] = useState("PENDING");
    const [errorMsg, setErrorMsg] = useState("");

    // Fetch existing KYC data on load
    useEffect(() => {
        async function fetchKyc() {
            try {
                const res = await fetch("/api/vendor/kyc");
                if (res.ok) {
                    const data = await res.json();
                    if (data.kycDocs) {
                        setDocs({
                            nationalId: data.kycDocs.nationalId || "",
                            businessReg: data.kycDocs.businessReg || "",
                            momoNumber: data.kycDocs.momoNumber || "",
                            nationalIdUrl: data.kycDocs.nationalIdUrl || "",
                            businessRegUrl: data.kycDocs.businessRegUrl || ""
                        });
                    }
                    if (data.kycStatus) setKycStatus(data.kycStatus);
                }
            } catch (err) {
                console.error("Failed to load KYC info", err);
            }
        }
        fetchKyc();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSaved(false);

        if (!docs.nationalIdUrl || !docs.businessRegUrl) {
            setErrorMsg("Please upload both National ID and Business Registration documents");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/vendor/kyc", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(docs),
            });

            const data = await res.json();
            if (res.ok) {
                setSaved(true);
                setKycStatus(data.kycStatus);
            } else {
                setErrorMsg(data.error || "Failed to submit documents");
            }
        } catch (err) {
            setErrorMsg("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const statusInfo = {
        PENDING: { icon: <Clock size={20} style={{ color: "#F59E0B" }} />, label: "Pending Review", desc: "Your documents are under review by our team. This may take 1–2 business days.", color: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", text: "#F59E0B" },
        APPROVED: { icon: <CheckCircle2 size={20} style={{ color: "#00B341" }} />, label: "KYC Approved", desc: "Your KYC has been approved. You can now list products and receive orders.", color: "rgba(0,179,65,0.1)", border: "rgba(0,179,65,0.3)", text: "#00B341" },
        REJECTED: { icon: <XCircle size={20} style={{ color: "#EF4444" }} />, label: "KYC Rejected", desc: "Your documents were rejected. Please re-upload correct documents.", color: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", text: "#EF4444" },
    };
    const si = statusInfo[kycStatus];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-black text-slate-900 mb-1">KYC Verification</h1>
            <p className="text-slate-500 text-sm mb-8">Verify your identity to start selling on PHAMON</p>

                {/* Status banner */}
                <div className="rounded-xl p-4 mb-8 flex items-start gap-3" style={{ background: si.color, border: `1px solid ${si.border}` }}>
                    {si.icon}
                    <div>
                        <div className="font-semibold" style={{ color: si.text }}>{si.label}</div>
                        <div className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{si.desc}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="card space-y-6">
                                <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Required Documents</h3>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">National ID / Passport</label>
                                    <div className="space-y-3">
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            placeholder="CM-XXXXXXXXX"
                                            value={docs.nationalId}
                                            onChange={e => setDocs({ ...docs, nationalId: e.target.value })}
                                        />
                                        <ImageUpload 
                                            value={docs.nationalIdUrl ? [docs.nationalIdUrl] : []} 
                                            onChange={(val) => setDocs({ ...docs, nationalIdUrl: val[val.length - 1] || "" })} 
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Enter your ID number and upload a clear photo/scan.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Registration</label>
                                    <div className="space-y-3">
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            placeholder="80000000019733"
                                            value={docs.businessReg}
                                            onChange={e => setDocs({ ...docs, businessReg: e.target.value })}
                                        />
                                        <ImageUpload 
                                            value={docs.businessRegUrl ? [docs.businessRegUrl] : []} 
                                            onChange={(val) => setDocs({ ...docs, businessRegUrl: val[val.length - 1] || "" })} 
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Enter your URSB number and upload your registration certificate.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Money Number (Payout)</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        placeholder="+256 700 000 000"
                                        value={docs.momoNumber}
                                        onChange={e => setDocs({ ...docs, momoNumber: e.target.value })}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">This is where your earnings will be sent.</p>
                                </div>

                                {errorMsg && <div className="px-4 py-3 rounded-xl text-sm mb-2" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>❌ {errorMsg}</div>}
                                {saved && <div className="px-4 py-3 rounded-xl text-sm mb-2" style={{ background: "rgba(0,179,65,0.1)", border: "1px solid rgba(0,179,65,0.2)", color: "#00B341" }}>✅ Documents submitted for review.</div>}

                                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                                    {loading ? <span className="spinner w-4 h-4" /> : <><Upload size={16} /> Submit for Review</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                        <div className="card">
                            <h3 className="font-bold mb-3" style={{ color: "var(--text-primary)" }}>What happens next?</h3>
                            <div className="space-y-3">
                                {[
                                    { step: "1", title: "Submit Documents", desc: "Fill in all required information above" },
                                    { step: "2", title: "Admin Review", desc: "Our team reviews within 1–2 business days" },
                                    { step: "3", title: "Approval Notification", desc: "You'll receive an SMS when approved" },
                                    { step: "4", title: "Start Selling", desc: "List products and receive orders immediately" },
                                ].map(item => (
                                    <div key={item.step} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(0,102,204,0.2)", color: "var(--primary-light)", border: "1px solid rgba(0,102,204,0.3)" }}>{item.step}</div>
                                        <div>
                                            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</div>
                                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-elevated p-4 flex items-start gap-3">
                            <AlertCircle size={18} style={{ color: "var(--accent)" }} />
                            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                                KYC is mandatory for all vendors. You cannot list products or receive payouts until your account is verified.
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
