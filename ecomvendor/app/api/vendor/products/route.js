import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import Vendor from "@/lib/models/Vendor";

// GET: Fetch all products for the logged-in vendor
export async function GET(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "VENDOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const vendor = await Vendor.findOne({ userId: session.user.id });
        if (!vendor) {
            return NextResponse.json({ products: [] });
        }
        const products = await Product.find({ vendorId: vendor._id }).sort({ createdAt: -1 });
        return NextResponse.json({ products });
    } catch (error) {
        console.error("Vendor products GET error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create a new product for the logged-in vendor
export async function POST(req) {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const vendor = await Vendor.findOne({ userId: session.user.id });
        if (!vendor) {
            return NextResponse.json({ error: "Vendor profile not found. Please complete KYC first." }, { status: 400 });
        }
        const body = await req.json();
        const { name, category, brand, compatibility, description, price, stock, status, images } = body;
        if (!name || !category || !brand || !price) {
            return NextResponse.json({ error: "Name, category, brand, and price are required." }, { status: 400 });
        }
        const product = await Product.create({
            vendorId: vendor._id,
            name, category, brand,
            compatibility: compatibility || "",
            description: description || "",
            price: Number(price),
            stock: Number(stock) || 0,
            images: images || [],
            status: status || "PENDING",
        });
        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error("Vendor products POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
