import mongoose, { Schema } from "mongoose";

const ReturnSchema = new Schema(
    {
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
        reason: { type: String, required: true },
        comment: { type: String },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Return || mongoose.model("Return", ReturnSchema);
