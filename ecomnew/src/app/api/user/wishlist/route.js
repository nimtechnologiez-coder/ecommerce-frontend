import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Helper to get the raw MongoDB collection for users (bypasses Mongoose schema caching)
async function getUsersCollection() {
    await dbConnect();
    return mongoose.connection.collection("users");
}

// Helper to get the raw MongoDB collection for products
async function getProductsCollection() {
    await dbConnect();
    return mongoose.connection.collection("products");
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const users = await getUsersCollection();
        const products = await getProductsCollection();

        // Get raw user document directly from MongoDB
        const user = await users.findOne({ _id: new mongoose.Types.ObjectId(session.user.id) });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const wishlistIds = (user.wishlist || []).filter(id => id);

        if (wishlistIds.length === 0) {
            return NextResponse.json([]);
        }

        // Fetch the actual product documents
        const wishlistProducts = await products
            .find({ _id: { $in: wishlistIds } })
            .toArray();
        
        // Convert _id to string for JSON compatibility
        const result = wishlistProducts.map(p => ({
            ...p,
            _id: p._id.toString(),
            vendorId: p.vendorId?.toString(),
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error("Wishlist GET Error:", error);
        return NextResponse.json({ 
            error: "Wishlist GET Failed", 
            details: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId } = await req.json();
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ error: "Valid Product ID required" }, { status: 400 });
        }

        const users = await getUsersCollection();
        const userId = new mongoose.Types.ObjectId(session.user.id);
        const productObjectId = new mongoose.Types.ObjectId(productId);

        // Get raw user document
        const user = await users.findOne({ _id: userId });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const wishlist = user.wishlist || [];
        const exists = wishlist.some(id => id.toString() === productId);

        let action = "";
        let updateOp;

        if (exists) {
            updateOp = { $pull: { wishlist: productObjectId } };
            action = "removed";
        } else {
            updateOp = { $addToSet: { wishlist: productObjectId } };
            action = "added";
        }

        // Raw MongoDB update - completely bypasses Mongoose schema
        const result = await users.updateOne({ _id: userId }, updateOp);
        
        // Get updated count
        const updatedUser = await users.findOne({ _id: userId }, { projection: { wishlist: 1 } });
        
        return NextResponse.json({ 
            success: true, 
            action, 
            wishlistCount: updatedUser?.wishlist?.length || 0,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error("Wishlist POST Error:", error);
        return NextResponse.json({ 
            error: "Wishlist POST Failed", 
            details: error.message 
        }, { status: 500 });
    }
}
