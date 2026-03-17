"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";

export async function addProduct(formData) {
    try {
        const session = await auth();
        
        if (!session?.user?.email) {
            return { success: false, error: "Unauthorized: No active session found." };
        }

        await dbConnect();
        
        // Ensure the current user is an admin
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== "ADMIN") {
            return { success: false, error: `Unauthorized: Only administrators can add products.` };
        }

        const name = formData.get("name");
        const description = formData.get("description");
        const brand = formData.get("brand");
        const compatibility = formData.get("compatibility");
        const price = parseFloat(formData.get("price"));
        const category = formData.get("category");
        const stock = parseInt(formData.get("stock"), 10);
        const vendorId = formData.get("vendorId");

        if (!name || !price || !category || !vendorId || !brand) {
            return { success: false, error: "Missing required fields (Name, Brand, Price, Category, Vendor)." };
        }

        const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=400`;

        const newProduct = await Product.create({
            name,
            description,
            brand,
            compatibility,
            price,
            category,
            stock: isNaN(stock) ? 0 : stock,
            vendorId,
            images: [placeholderImage],
            status: "DRAFT"
        });

        revalidatePath("/products");
        return { success: true, message: "Product successfully created." };
    } catch (error) {
        console.error("Failed to add product:", error.message);
        return { success: false, error: error.message };
    }
}
