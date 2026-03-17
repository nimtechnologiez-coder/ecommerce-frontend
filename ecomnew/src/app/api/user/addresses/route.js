import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).select("addresses");
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user.addresses || []);
    } catch (error) {
        console.error("Addresses GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const addressData = await req.json();
        const { name, phone, address, city, isDefault } = addressData;

        if (!name || !phone || !address || !city) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Handle default address logic
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        // If this is the first address, make it default
        const newAddress = {
            name,
            phone,
            address,
            city,
            isDefault: user.addresses.length === 0 ? true : isDefault
        };

        user.addresses.push(newAddress);
        await user.save();

        return NextResponse.json(user.addresses);
    } catch (error) {
        console.error("Addresses POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { addressId, ...updateData } = await req.json();

        await dbConnect();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }

        // Handle default address logic
        if (updateData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, updateData);
        await user.save();

        return NextResponse.json(user.addresses);
    } catch (error) {
        console.error("Addresses PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const addressId = searchParams.get("id");

        if (!addressId) {
            return NextResponse.json({ error: "Address ID required" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.addresses.pull({ _id: addressId });
        
        // Ensure there's always a default address if possible
        if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        return NextResponse.json(user.addresses);
    } catch (error) {
        console.error("Addresses DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
