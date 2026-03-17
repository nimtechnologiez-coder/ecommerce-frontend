import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product" },
                vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                image: { type: String },
                quantity: { type: Number, default: 1 },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
