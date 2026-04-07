"use server";

import { revalidatePath } from "next/cache";

/**
 * Updates a return request's status and automatically refunds the order if approved.
 */
export async function updateReturnStatus(returnId, status) {
    try {
        // Dynamic imports for database-related models/logic
        const { auth } = await import("@/lib/auth");
        const dbConnect = (await import("@/lib/db")).default;
        const Return = (await import("@/lib/models/Return")).default;
        const User = (await import("@/lib/models/User")).default;
        const Order = (await import("@/lib/models/Order")).default;

        const session = await auth();
        
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized: No active session found." };
        }

        await dbConnect();
        
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== "ADMIN") {
            return { success: false, error: "Unauthorized: Only administrators can update return status." };
        }

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return { success: false, error: "Invalid status provided." };
        }

        const returnReq = await Return.findByIdAndUpdate(
            returnId, 
            { status: status },
            { new: true }
        );

        if (!returnReq) {
            return { success: false, error: "Return request not found." };
        }

        // If approved, update the corresponding order's payment status
        if (status === "APPROVED") {
            await Order.findByIdAndUpdate(returnReq.orderId, { paymentStatus: "REFUNDED" });
        }

        revalidatePath("/refunds");
        revalidatePath("/orders");

        return { success: true, message: `Return request successfully ${status.toLowerCase()}.` };
    } catch (error) {
        console.error("Failed to update return status:", error.message);
        return { success: false, error: error.message };
    }
}
