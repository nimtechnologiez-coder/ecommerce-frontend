import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
    {
        vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
        name: { type: String, required: true },
        description: { type: String },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        compatibility: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        images: { type: [String], default: [] },
        status: { type: String, enum: ["DRAFT", "PENDING", "LIVE", "REJECTED"], default: "DRAFT" },
        adminRemarks: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
