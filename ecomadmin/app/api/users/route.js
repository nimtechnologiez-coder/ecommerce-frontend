import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";

// GET /api/admin/users - List all users
export async function GET(req) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const filter = {};
        if (role) filter.role = role;
        if (search) filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];

        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(filter),
        ]);

        return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        console.error("Admin Users GET Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
