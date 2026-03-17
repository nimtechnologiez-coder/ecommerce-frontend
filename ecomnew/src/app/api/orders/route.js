import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import Cart from "@/lib/models/Cart";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/orders - list orders for current user or admin/vendor
export async function GET(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");

    let orders;
    if (session.user.role === "ADMIN") {
        orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    } else if (session.user.role === "VENDOR" && vendorId) {
        // Vendor sees only their sub-orders
        orders = await Order.find({ "vendorOrders.vendorId": vendorId }).sort({ createdAt: -1 }).lean();
    } else {
        orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json(orders);
}

// POST /api/orders - create order from cart
export async function POST(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { deliveryAddress, paymentRef, paymentMethod } = await req.json();

    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Group items by vendor
    const vendorMap= {};
    for (const item of cart.items) {
        const key = item.vendorId.toString();
        if (!vendorMap[key]) vendorMap[key] = [];
        vendorMap[key].push(item);
    }

    const vendorOrders = Object.entries(vendorMap).map(([vendorId, items]) => ({
        vendorId,
        items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
        })),
        status: "PENDING",
        subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
    }));

    const subtotal = vendorOrders.reduce((s, v) => s + v.subtotal, 0);
    const deliveryFee = 5000;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
        userId: session.user.id,
        vendorOrders,
        deliveryAddress,
        paymentStatus: "PENDING",
        paymentRef,
        paymentMethod,
        total,
        deliveryFee,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    return NextResponse.json(order, { status: 201 });
}
