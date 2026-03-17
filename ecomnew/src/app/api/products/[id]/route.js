import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(_req, { params }) {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id).populate("vendorId", "businessName").lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
}

export async function PUT(req, { params }) {
    const session = await auth();
    if (!session || session.user.role !== "VENDOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const product = await Product.findByIdAndUpdate(id, { ...data, status: "PENDING" }, { new: true });
    return NextResponse.json(product);
}

export async function DELETE(_req, { params }) {
    const session = await auth();
    if (!session || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
}
