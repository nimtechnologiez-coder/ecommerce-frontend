"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import { auth } from "@/lib/auth";
import User from "@/lib/models/User";

/**
 * Approve or reject a product listing
 * @param {string} productId
 * @param {"LIVE" | "REJECTED"} status
 * @param {string} [adminRemarks]
 */
export async function reviewProduct(productId, status, adminRemarks = "") {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        await dbConnect();

        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return { success: false, error: "Forbidden: Admin access required" };
        }

        if (!["LIVE", "REJECTED", "PENDING", "DRAFT"].includes(status)) {
            return { success: false, error: "Invalid status" };
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { status, adminRemarks },
            { new: true }
        );

        if (!product) {
            return { success: false, error: "Product not found" };
        }

        revalidatePath(`/products/${productId}`);
        revalidatePath("/products");

        return { success: true, message: `Product status set to ${status}` };
    } catch (error) {
        console.error("reviewProduct error:", error);
        return { success: false, error: error.message };
    }
}

export async function updateProduct(productId, formData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized" };
        }

        await dbConnect();

        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return { success: false, error: "Forbidden: Admin access required" };
        }

        const updates = {
            name: formData.get("name"),
            brand: formData.get("brand"),
            description: formData.get("description"),
            compatibility: formData.get("compatibility"),
            price: Number(formData.get("price")),
            stock: Number(formData.get("stock")),
            category: formData.get("category"),
            vendorId: formData.get("vendorId"),
            status: formData.get("status"),
        };

        const product = await Product.findByIdAndUpdate(productId, updates, { new: true });

        if (!product) {
            return { success: false, error: "Product not found" };
        }

        revalidatePath(`/products/${productId}`);
        revalidatePath("/products");

        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        console.error("updateProduct error:", error);
        return { success: false, error: error.message };
    }
}
