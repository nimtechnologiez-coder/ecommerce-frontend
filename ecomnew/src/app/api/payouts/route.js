import dbConnect from "@/lib/db";
import Payout from "@/lib/models/Payout";
import Vendor from "@/lib/models/Vendor";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const payouts = await Payout.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(payouts);
}

export async function POST(req) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const { vendorId, amount, momoNumber } = await req.json();

    // Deduct from vendor pending balance, mark
    await Vendor.findByIdAndUpdate(vendorId, {
        $inc: { pendingBalance: -amount, walletBalance: amount },
    });

    const payout = await Payout.create({
        vendorId,
        amount,
        momoNumber,
        status: "COMPLETED",
        initiatedBy: session.user.id,
    });

    // Mark out - deduct from wallet
    await Vendor.findByIdAndUpdate(vendorId, {
        $inc: { walletBalance: -amount },
    });

    return NextResponse.json(payout, { status: 201 });
}
