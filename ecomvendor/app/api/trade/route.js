import dbConnect from "@/lib/db";
import Trade from "@/lib/models/Trade";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    await dbConnect();
    // Vendors only see their own trades
    const trades = await Trade.find({ sellerId: session.user.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(trades);
}

export async function POST(req) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    await dbConnect();
    const data = await req.json();
    const trade = await Trade.create({ 
        ...data, 
        sellerId: session.user.id, 
        status: "PENDING" 
    });
    return NextResponse.json(trade, { status: 201 });
}
