import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        return Response.json({ status: "ok", session });
    } catch (error) {
        return Response.json({ status: "error", message: error.message, stack: error.stack }, { status: 500 });
    }
}
