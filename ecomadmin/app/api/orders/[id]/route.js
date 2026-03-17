import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { auth } from "@/lib/auth";
import User from "@/lib/models/User";

// GET /api/admin/orders/[id] - Get single order details
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        const order = await Order.findById(id).populate("userId", "name email phone").lean();
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// PUT /api/admin/orders/[id] - Update order status (payment/delivery)
export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const { paymentStatus, deliveryStatus, adminNote } = await req.json();

        const updateFields = {};
        if (paymentStatus) updateFields.paymentStatus = paymentStatus;
        if (deliveryStatus) updateFields.deliveryStatus = deliveryStatus;
        if (adminNote) updateFields.adminNote = adminNote;

        const order = await Order.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).populate("userId", "name email");

        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Admin Order PUT Error:", error);
        return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
    }
}
