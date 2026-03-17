import mongoose, { Schema } from "mongoose";

const TradeSchema = new Schema(
    {
        sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        buyerId: { type: Schema.Types.ObjectId, ref: "User" },
        title: { type: String, required: true },
        description: { type: String },
        images: { type: [String], default: [] },
        askingPrice: { type: Number, required: true },
        category: { type: String, required: true },
        status: {
            type: String,
            enum: ["PENDING", "COUNTERED", "ACCEPTED", "CANCELLED"],
            default: "PENDING",
        },
        offerHistory: [
            {
                fromUserId: { type: Schema.Types.ObjectId, ref: "User" },
                amount: { type: Number, required: true },
                note: { type: String },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        contractUrl: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);
