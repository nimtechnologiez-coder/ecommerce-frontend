import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";
import mongoose from "mongoose";

// GET: Fetch vendor KYC status and docs
export async function GET(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "VENDOR") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        await dbConnect();
        
        const vendor = await Vendor.findOne({ userId: session.user.id });
        if (!vendor) {
            return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
        }
        
        return NextResponse.json({
            kycStatus: vendor.kycStatus,
            kycDocs: vendor.kycDocs || {},
            adminRemarks: vendor.adminRemarks || ""
        });
    } catch (error) {
        console.error("KYC GET error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// PUT: Submit or update KYC docs
export async function PUT(req) {
    try {
        const session = await auth();
        
        if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
            return NextResponse.json({ error: "Unauthorized (Must be VENDOR to submit KYC)" }, { status: 401 });
        }
        
        const body = await req.json();
        const { nationalId, businessReg, momoNumber, nationalIdUrl, businessRegUrl } = body;
        
        if (!nationalId || !businessReg || !momoNumber || !nationalIdUrl || !businessRegUrl) {
            return NextResponse.json({ error: "All fields including document uploads are required" }, { status: 400 });
        }
        
        await dbConnect();
        
        const existingVendor = await Vendor.findOne({ userId: session.user.id });
        
        if (!existingVendor) {
            // First time submitting KYC
            const newVendor = await Vendor.create({
                userId: session.user.id,
                businessName: session.user.name || "Vendor",
                kycStatus: "PENDING",
                kycDocs: { nationalId, businessReg, momoNumber, nationalIdUrl, businessRegUrl },
                walletBalance: 0,
                pendingBalance: 0
            });
            return NextResponse.json({ success: true, kycStatus: "PENDING" });
        } else {
            // Update existing
            const newStatus = existingVendor.kycStatus === "REJECTED" ? "PENDING" : existingVendor.kycStatus;
            
            existingVendor.kycDocs = { nationalId, businessReg, momoNumber, nationalIdUrl, businessRegUrl };
            existingVendor.kycStatus = newStatus;
            await existingVendor.save();

            return NextResponse.json({ success: true, kycStatus: newStatus });
        }
    } catch (error) {
        console.error("KYC PUT error:", error);
        return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
    }
}
