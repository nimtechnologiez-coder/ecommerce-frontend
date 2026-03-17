"use server";
import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateVendorSettings(formData) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "VENDOR") {
            return { error: "Unauthorized" };
        }

        await dbConnect();
        
        const storeLogo = formData.get("storeLogo") || "";
        const storeBanner = formData.get("storeBanner") || "";
        const description = formData.get("description") || "";
        const storeAnnouncement = formData.get("storeAnnouncement") || "";
        const whatsapp = formData.get("whatsapp") || "";
        const facebook = formData.get("facebook") || "";
        const instagram = formData.get("instagram") || "";

        await Vendor.findOneAndUpdate(
            { userId: session.user.id },
            { 
                $set: { 
                    storeLogo, 
                    storeBanner, 
                    description, 
                    storeAnnouncement,
                    socialLinks: { whatsapp, facebook, instagram }
                } 
            },
            { new: true }
        );

        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update vendor settings:", error);
        return { error: error.message || "Failed to update settings" };
    }
}
