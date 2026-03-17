import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Admin approve/reject product
export async function PUT(req, { params }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { id } = await params;
    const { status, adminRemarks } = await req.json();
    const product = await Product.findByIdAndUpdate(id, { status, adminRemarks }, { new: true });
    return NextResponse.json(product);
}
