import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// PUT /api/vendors/:id/kyc - Admin approve/reject
export async function PUT(req, { params }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { id } = await params;
    const { kycStatus, adminRemarks } = await req.json();
    const vendor = await Vendor.findByIdAndUpdate(id, { kycStatus, adminRemarks }, { new: true });
    return NextResponse.json(vendor);
}

// GET /api/vendors/:id/kyc - Get vendor profile
export async function GET(_req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const vendor = await Vendor.findByIdid.populate("userId", "name email phone").lean();
    if (!vendor) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(vendor);
}

// PATCH /api/vendors/:id/kyc - Vendor submits KYC docs
export async function PATCH(req, { params }) {
    const session = await auth();
    if (!session || session.user.role !== "VENDOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { id } = await params;
    const { kycDocs } = await req.json();
    const vendor = await Vendor.findByIdAndUpdate(id, { kycDocs, kycStatus: "PENDING" }, { new: true });
    return NextResponse.json(vendor);
}
