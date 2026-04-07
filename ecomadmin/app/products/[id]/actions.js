"use server";

import { revalidatePath } from "next/cache";

/**
 * Approve or reject a product listing
 */
export async function reviewProduct(productId, status, adminRemarks = "") {
    try {
        const { auth } = await import("@/lib/auth");
        const dbConnect = (await import("@/lib/db")).default;
        const Product = (await import("@/lib/models/Product")).default;
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
        const { auth } = await import("@/lib/auth");
        const dbConnect = (await import("@/lib/db")).default;
        const Product = (await import("@/lib/models/Product")).default;
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
