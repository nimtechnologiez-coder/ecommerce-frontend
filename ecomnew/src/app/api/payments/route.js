import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

// Simulated Mobile Money payment initiation
export async function POST(req) {
    await dbConnect();
    const { orderId, phone } = await req.json();
    const order = await Order.findById(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Simulate: generate a reference number
    const paymentRef = `MM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    order.paymentRef = paymentRef;
    order.paymentStatus = "PENDING";
    await order.save();

    return NextResponse.json({
        message: "Payment initiated. Approve on your phone.",
        paymentRef,
        amount: order.total,
        phone,
    });
}
