"use server";

export async function getDashboardAnalytics() {
    try {
        // Dynamic imports for analytics logic
        const dbConnect = (await import("@/lib/db")).default;
        const Order = (await import("@/lib/models/Order")).default;

        await dbConnect();
        
        // Get sales data for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    paymentStatus: "PAID"
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$total" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Get order status distribution
        const statusDistribution = await Order.aggregate([
            { $unwind: "$vendorOrders" },
            {
                $group: {
                    _id: "$vendorOrders.status",
                    value: { $sum: 1 }
                }
            }
        ]);

        return {
            dailyOrders: dailyOrders.map(d => ({
                date: new Date(d._id).toLocaleDateString("en-US", { weekday: 'short' }),
                revenue: d.revenue,
                orders: d.count
            })),
            statusDistribution: statusDistribution.map(s => ({
                name: s._id,
                value: s.value
            }))
        };
    } catch (error) {
        console.error("Analytics Error:", error);
        return { error: "Failed to fetch analytics" };
    }
}
