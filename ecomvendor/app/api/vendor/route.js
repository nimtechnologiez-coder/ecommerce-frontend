import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Vendor from "@/lib/models/Vendor";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        // Simple vendor creation for testing - ideally this happens via a separate flow
        const vendor = await Vendor.create(body);
        return NextResponse.json(vendor);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
