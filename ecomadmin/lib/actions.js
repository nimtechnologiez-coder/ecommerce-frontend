"use server";

export async function uploadImageAction(formData) {
    try {
        const { auth } = await import("@/lib/auth");
        const session = await auth();
        
        if (!session || !session.user || session.user.role !== "ADMIN") {
            throw new Error("Unauthorized");
        }

        const { v2: cloudinary } = await import("cloudinary");
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const file = formData.get("file");
        if (!file) throw new Error("No file provided");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.write(buffer);
            stream.end();
        });

        return { url: result.secure_url };
    } catch (error) {
        console.error("Server Action Upload Error:", error);
        return { error: error.message || "Upload failed" };
    }
}
