"use server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageAction(formData) {
    try {
        const session = await auth();
        
        if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            throw new Error("Unauthorized");
        }

        const file = formData.get("file");
        if (!file) throw new Error("No file provided");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return { url: result.secure_url };
    } catch (error) {
        console.error("Server Action Upload Error:", error);
        return { error: error.message || "Upload failed" };
    }
}
