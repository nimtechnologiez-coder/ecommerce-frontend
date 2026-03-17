import dbConnect from "@/lib/db";
import Return from "@/lib/models/Return";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const filter = {};
    if (session.user.role === "CUSTOMER") filter.userId = session.user.id;
    else if (searchParams.get("vendorId")) filter.vendorId = searchParams.get("vendorId");
    const returns = await Return.findfilter.sort({ createdAt: -1 }).lean();
    return NextResponse.json(returns);
}

export async function POST(req) {
    const session = await auth();
    if (!session || session.user.role !== "CUSTOMER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { orderId, reason, comment } = await req.json();

    const Order = (await import("@/lib/models/Order")).default;
    const order = await Order.findById(orderId);
    if (!order || !order.vendorOrders?.length) {
        return NextResponse.json({ error: "Order or vendor not found" }, { status: 404 });
    }
    
    const vendorId = order.vendorOrders[0].vendorId;

    const returnReq = await Return.create({
        orderId, vendorId, reason, comment,
        userId: session.user.id,
        status: "PENDING",
    });
    return NextResponse.json(returnReq, { status: 201 });
}

export async function PUT(req) {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VENDOR")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { id, status } = await req.json();
    const ret = await Return.findByIdAndUpdate(id, { status }, { new: true });
    if (status === "APPROVED") {
        const Order = (await import("@/lib/models/Order")).default;
        await Order.findByIdAndUpdate(ret?.orderId, { paymentStatus: "REFUNDED" });
    }
    return NextResponse.json(ret);
}
