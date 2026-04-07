import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        businessName: { type: String, required: true },
        kycStatus: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
        kycDocs: {
            nationalId: { type: String },
            businessReg: { type: String },
            momoNumber: { type: String },
            nationalIdUrl: { type: String },
            businessRegUrl: { type: String },
        },
        adminRemarks: { type: String },
        walletBalance: { type: Number, default: 0 },
        pendingBalance: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
export default Vendor;
