import dbConnect from "@/lib/db";
import Cart from "@/lib/models/Cart";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            console.log("Cart GET: No session found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        console.log(`Cart GET: Fetching for user ${session.user.id}`);
        
        const cart = await Cart.findOne({ userId: session.user.id }).lean();
        if (!cart) {
            console.log("Cart GET: No cart found for user");
            return NextResponse.json({ items: [] });
        }

        console.log(`Cart GET: Found ${cart.items?.length || 0} items`);
        return NextResponse.json(cart);
    } catch (err) {
        console.error("Cart GET Error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        await dbConnect();
        
        const { productId, quantity } = await req.json();
        console.log(`Cart POST: Adding ${productId} (qty ${quantity}) for user ${session.user.id}`);

        const Product = (await import("@/lib/models/Product")).default;
        
        // Validate Product ID format
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ error: "Invalid Product ID" }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product || product.status !== "LIVE") {
            return NextResponse.json({ error: "Product not available" }, { status: 400 });
        }
        if (product.stock < quantity) {
            return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
        }

        let cart = await Cart.findOne({ userId: session.user.id });
        if (!cart) {
            cart = await Cart.create({
                userId: session.user.id,
                items: [{
                    productId: product._id,
                    vendorId: product.vendorId,
                    name: product.name,
                    price: product.price,
                    image: product.images[0] || "",
                    quantity,
                }],
            });
        } else {
            const existingIndex = cart.items.findIndex((i) => i.productId.toString() === productId);
            if (existingIndex >= 0) {
                cart.items[existingIndex].quantity += quantity;
            } else {
                cart.items.push({
                    productId: product._id,
                    vendorId: product.vendorId,
                    name: product.name,
                    price: product.price,
                    image: product.images[0] || "",
                    quantity,
                });
            }
            await cart.save();
        }

        console.log("Cart POST: Success");
        return NextResponse.json(cart);
    } catch (err) {
        console.error("Cart POST Error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        await dbConnect();

        const { productId, quantity } = await req.json();
        const cart = await Cart.findOne({ userId: session.user.id });
        if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

        if (quantity <= 0) {
            cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
        } else {
            const item = cart.items.find((i) => i.productId.toString() === productId);
            if (item) item.quantity = quantity;
        }
        await cart.save();
        return NextResponse.json(cart);
    } catch (err) {
        console.error("Cart PUT Error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        await dbConnect();

        const { productId } = await req.json();
        const cart = await Cart.findOne({ userId: session.user.id });
        if (cart) {
            cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
            await cart.save();
        }
        return NextResponse.json({ message: "Removed" });
    } catch (err) {
        console.error("Cart DELETE Error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
