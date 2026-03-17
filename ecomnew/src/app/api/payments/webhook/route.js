import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Vendor from "@/lib/models/Vendor";
import { NextResponse } from "next/server";

// Webhook: called by payment gateway (or simulated)
export async function POST(req) {
    await dbConnect();
    const { paymentRef, status } = await req.json();

    const order = await Order.findOne({ paymentRef });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (status === "SUCCESS") {
        order.paymentStatus = "PAID";

        // Reduce stock and credit vendor wallets
        for (const vendorOrder of order.vendorOrders) {
            for (const item of vendorOrder.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity },
                });
            }
            // Credit 95% to vendor pending balance (5% platform fee)
            const vendorEarning = vendorOrder.subtotal * 0.95;
            await Vendor.findByIdAndUpdate(vendorOrder.vendorId, {
                $inc: { pendingBalance: vendorEarning },
            });
        }
    } else if (status === "FAILED") {
        order.paymentStatus = "FAILED";
    }

    await order.save();
    return NextResponse.json({ message: "Webhook processed", paymentStatus: order.paymentStatus });
}
