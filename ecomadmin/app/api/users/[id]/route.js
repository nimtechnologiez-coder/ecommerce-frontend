import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";

// PUT /api/admin/users/[id] - Update user (role, status, etc.)
export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const { role, name } = await req.json();

        const allowedRoles = ["CUSTOMER", "VENDOR", "ADMIN"];
        if (role && !allowedRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const updateFields = {};
        if (role) updateFields.role = role;
        if (name) updateFields.name = name;

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        ).select("-password");

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Admin User PUT Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const adminUser = await User.findOne({ email: session.user.email });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        // Prevent deleting self
        if (id === adminUser._id.toString()) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("Admin User DELETE Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
