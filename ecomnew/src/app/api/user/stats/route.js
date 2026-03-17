import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import Return from "@/lib/models/Return";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        
        // Parallel fetching for performance
        const [user, orders, returns] = await Promise.all([
            User.findById(session.user.id).select("wishlist addresses"),
            Order.find({ userId: session.user.id }),
            Return.find({ userId: session.user.id })
        ]);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate stats
        const stats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.paymentStatus !== "PAID").length,
            paidOrders: orders.filter(o => o.paymentStatus === "PAID").length,
            wishlistCount: user.wishlist?.length || 0,
            addressCount: user.addresses?.length || 0,
            returnCount: returns.length,
            recentOrders: orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("User Stats GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
