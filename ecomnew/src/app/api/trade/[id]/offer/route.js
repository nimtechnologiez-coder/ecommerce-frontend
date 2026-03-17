import dbConnect from "@/lib/db";
import Trade from "@/lib/models/Trade";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req, { params }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await dbConnect();
    const { id } = await params;
    const { amount, note, action } = await req.json();

    const trade = await Trade.findById(id);
    if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "ACCEPT") {
        trade.status = "ACCEPTED";
        trade.buyerId = session.user.id;
    } else if (action === "CANCEL") {
        trade.status = "CANCELLED";
    } else {
        // Send offer / counter-offer
        trade.offerHistory.push({
            fromUserId: session.user.id,
            amount,
            note,
            createdAt: new Date(),
        });
        trade.status = "COUNTERED";
        trade.buyerId = session.user.id;
    }

    await trade.save();
    return NextResponse.json(trade);
}
