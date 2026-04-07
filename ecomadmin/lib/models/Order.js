import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        vendorOrders: [
            {
                vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
                items: [
                    {
                        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                        name: { type: String, required: true },
                        price: { type: Number, required: true },
                        quantity: { type: Number, required: true },
                        image: { type: String },
                    },
                ],
                status: {
                    type: String,
                    enum: ["PENDING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"],
                    default: "PENDING",
                },
                courierName: { type: String },
                trackingNumber: { type: String },
                subtotal: { type: Number, required: true },
            },
        ],
        deliveryAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            default: "PENDING",
        },
        paymentRef: { type: String },
        total: { type: Number, required: true },
        deliveryFee: { type: Number, default: 5000 },
    },
    { timestamps: true }
);

// Standard Next.js singleton pattern
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
