import mongoose, { Schema } from "mongoose";

const VendorSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
        storeLogo: { type: String },
        storeBanner: { type: String },
        description: { type: String },
        storeAnnouncement: { type: String },
        walletBalance: { type: Number, default: 0 },
        pendingBalance: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
