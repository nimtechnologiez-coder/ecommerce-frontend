import dbConnect from "@/lib/db";
import Trade from "@/lib/models/Trade";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const filter = {};
    if (status) filter.status = status;
    const trades = await Trade.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(trades);
}

export async function POST(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const data = await req.json();
    const trade = await Trade.create({ ...data, sellerId: session.user.id, status: "PENDING" });
    return NextResponse.json(trade, { status: 201 });
}
