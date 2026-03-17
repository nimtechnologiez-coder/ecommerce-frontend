import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;

        const vendor = await Vendor.findById(id).populate("userId", "name").lean();
        if (!vendor) {
            return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
        }

        // Get live products for this vendor
        const products = await Product.find({ 
            vendorId: id, 
            status: "LIVE" 
        }).sort({ createdAt: -1 });

        return NextResponse.json({
            vendor,
            products
        });
    } catch (error) {
        console.error("Fetch vendor error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
