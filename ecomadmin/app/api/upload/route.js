import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        console.log("Upload request received");
        const session = await auth();
        
        if (!session || !session.user || session.user.role !== "ADMIN") {
            console.log("Unauthorized upload attempt. Session:", JSON.stringify(session));
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Cloudinary credentials missing in .env.local");
            return NextResponse.json({ error: "Cloudinary configuration missing" }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload stream error:", error);
                        reject(error);
                    } else {
                        console.log("Cloudinary upload successful:", result.secure_url);
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        console.error("Upload error details:", error);
        return NextResponse.json({ error: "Upload failed: " + (error.message || "Unknown error") }, { status: 500 });
    }
}
