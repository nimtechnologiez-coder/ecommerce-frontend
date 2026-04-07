"use server";

import { revalidatePath } from "next/cache";

/**
 * Updates an order's payment or delivery status
 */
export async function updateOrderStatus(orderId, status, type = "paymentStatus") {
    try {
        // Dynamic imports for Server-only logic
        const { auth } = await import("@/lib/auth");
        const dbConnect = (await import("@/lib/db")).default;
        const Order = (await import("@/lib/models/Order")).default;
        const User = (await import("@/lib/models/User")).default;

        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        await dbConnect();

        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return { success: false, error: "Forbidden: Admin access required" };
        }

        const allowedPaymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
        const allowedDeliveryStatuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

        if (type === "paymentStatus" && !allowedPaymentStatuses.includes(status)) {
            return { success: false, error: "Invalid payment status" };
        }
        if (type === "deliveryStatus" && !allowedDeliveryStatuses.includes(status)) {
            return { success: false, error: "Invalid delivery status" };
        }

        const updateField = { [type]: status };
        const order = await Order.findByIdAndUpdate(orderId, updateField, { new: true });

        if (!order) {
            return { success: false, error: "Order not found" };
        }

        revalidatePath(`/orders/${orderId}`);
        revalidatePath("/orders");

        return { success: true, message: `Order ${type} updated to ${status}` };
    } catch (error) {
        console.error("updateOrderStatus error:", error);
        return { success: false, error: error.message };
    }
}
