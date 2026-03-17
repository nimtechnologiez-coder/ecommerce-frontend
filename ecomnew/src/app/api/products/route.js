import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/products - public listing
export async function GET(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const vendorId = searchParams.get("vendorId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const filter = { status: "LIVE" };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseInt(minPrice);
        if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (vendorId) {
        filter.vendorId = vendorId;
        delete filter.status; // vendors can see all their products
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Product.countDocuments(filter),
    ]);

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

// POST /api/products - vendor creates product
export async function POST(req) {
    const session = await auth();
    if (!session || session.user.role !== "VENDOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const data = await req.json();

    // Get vendor profile
    const Vendor = (await import("@/lib/models/Vendor")).default;
    const vendor = await Vendor.findOne({ userId: session.user.id });
    if (!vendor || vendor.kycStatus !== "APPROVED") {
        return NextResponse.json({ error: "Vendor not approved" }, { status: 403 });
    }

    const product = await Product.create({
        ...data,
        vendorId: vendor._id,
        status: data.status === "DRAFT" ? "DRAFT" : "PENDING",
    });

    return NextResponse.json(product, { status: 201 });
}
