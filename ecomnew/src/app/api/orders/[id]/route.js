import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(_req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id).lean();
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
}

export async function PUT(req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const { vendorOrderIndex, status, courierName, trackingNumber } = await req.json();

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (vendorOrderIndex !== undefined) {
        order.vendorOrders[vendorOrderIndex].status = status;
        if (courierName) order.vendorOrders[vendorOrderIndex].courierName = courierName;
        if (trackingNumber) order.vendorOrders[vendorOrderIndex].trackingNumber = trackingNumber;
    }

    await order.save();
    return NextResponse.json(order);
}
