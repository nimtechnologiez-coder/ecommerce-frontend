import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/lib/models/Order";
import { auth } from "@/lib/auth";
import User from "@/lib/models/User";

// GET /api/admin/orders - List all orders (with filters)
export async function GET(req) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        // Verify admin role
        await dbConnect();
        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const filter = {};
        if (status) filter.paymentStatus = status;

        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("userId", "name email phone")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);

        return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        console.error("Admin Orders GET Error:", error);
        return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
    }
}
