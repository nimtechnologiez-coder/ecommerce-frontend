"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";

/**
 * Updates a vendor's KYC status.
 * @param {string} vendorId - The ID of the vendor to update.
 * @param {string} status - The new status (APPROVED or REJECTED).
 */
export async function updateVendorStatus(vendorId, status) {
    try {
        const session = await auth();
        
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized: No active session found." };
        }

        await dbConnect();
        
        // Fetch the user from the DB to guarantee we have the latest role, bypassing potentially stale JWTs.
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== "ADMIN") {
            return { success: false, error: `Unauthorized: Only administrators can update vendor status. Current role in DB: ${currentUser?.role}` };
        }

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return { success: false, error: "Invalid status provided." };
        }

        await dbConnect();
        
        const vendor = await Vendor.findByIdAndUpdate(
            vendorId, 
            { kycStatus: status },
            { new: true }
        );

        if (!vendor) {
            return { success: false, error: "Vendor not found." };
        }

        revalidatePath(`/vendors/${vendorId}`);
        revalidatePath("/vendors");

        return { success: true, message: `Vendor status successfully updated to ${status}.` };
    } catch (error) {
        console.error("Failed to update vendor status:", error.message);
        return { success: false, error: error.message };
    }
}
