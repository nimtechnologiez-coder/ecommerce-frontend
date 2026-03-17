"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Return from "@/lib/models/Return";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import { auth } from "@/lib/auth";

/**
 * Updates a return request's status and automatically refunds the order if approved.
 * @param {string} returnId - The ID of the return request.
 * @param {string} status - The new status (APPROVED or REJECTED).
 */
export async function updateReturnStatus(returnId, status) {
    try {
        const session = await auth();
        
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized: No active session found." };
        }

        await dbConnect();
        
        // Ensure the current user is an admin
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== "ADMIN") {
            return { success: false, error: `Unauthorized: Only administrators can update return status.` };
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
        revalidatePath("/orders"); // In case the order's payment status changed

        return { success: true, message: `Return request successfully ${status.toLowerCase()}.` };
    } catch (error) {
        console.error("Failed to update return status:", error.message);
        return { success: false, error: error.message };
    }
}
