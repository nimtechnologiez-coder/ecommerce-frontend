import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET /api/vendors - Admin gets all vendors
export async function GET() {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const vendors = await Vendor.find({}).populate("userId", "name email phone").lean();
    return NextResponse.json(vendors);
}
