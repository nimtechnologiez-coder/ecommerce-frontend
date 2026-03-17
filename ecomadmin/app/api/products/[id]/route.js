import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { auth } from "@/lib/auth";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await dbConnect();
        const product = await Product.findById(id).populate('vendorId');
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        await dbConnect();
        const updated = await Product.findByIdAndUpdate(id, body, { new: true });

        if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
