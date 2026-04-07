"use server";

import { revalidatePath } from "next/cache";

/**
 * Updates a vendor's KYC status.
 * @param {string} vendorId - The ID of the vendor to update.
 * @param {string} status - The new status (APPROVED or REJECTED).
 */
export async function updateVendorStatus(vendorId, status) {
    try {
        // Dynamic imports to isolate database logic from build-time analysis
        const { auth } = await import("@/lib/auth");
        const dbConnect = (await import("@/lib/db")).default;
        const Vendor = (await import("@/lib/models/Vendor")).default;
        const User = (await import("@/lib/models/User")).default;

        const session = await auth();
        
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized: No active session found." };
        }

        await dbConnect();
        
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== "ADMIN") {
            return { success: false, error: "Unauthorized: Only administrators can update vendor status." };
        }

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return { success: false, error: "Invalid status provided." };
        }
        
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
