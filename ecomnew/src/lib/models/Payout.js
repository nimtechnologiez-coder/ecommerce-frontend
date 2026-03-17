import mongoose, { Schema } from "mongoose";

const PayoutSchema = new Schema(
    {
        vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
        amount: { type: Number, required: true },
        momoNumber: { type: String, required: true },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING",
        },
        initiatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Payout || mongoose.model("Payout", PayoutSchema);
