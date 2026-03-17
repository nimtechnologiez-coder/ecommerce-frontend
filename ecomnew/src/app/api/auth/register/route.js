import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Vendor from "@/lib/models/Vendor";

// POST /api/auth/register
export async function POST(req) {
    try {
        const { name, email, password, phone, role, businessName } = await req.json();

        await dbConnect();
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashed, phone, role: role || "CUSTOMER" });

        // If vendor, create vendor profile
        if (role === "VENDOR" && businessName) {
            await Vendor.create({
                userId: user._id,
                businessName,
                kycStatus: "PENDING",
            });
        }

        return NextResponse.json({ message: "Registered successfully", userId: user._id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
