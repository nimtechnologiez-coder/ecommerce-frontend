import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
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

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
