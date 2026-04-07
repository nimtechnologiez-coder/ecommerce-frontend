import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/login", "/register", "/"].includes(nextUrl.pathname);

    console.log(`[Vendor Middleware] Request: ${nextUrl.pathname}, LoggedIn: ${isLoggedIn}`);

    if (isApiAuthRoute) return NextResponse.next();

    if (isPublicRoute) {
        if (isLoggedIn && nextUrl.pathname !== "/") {
            return Response.redirect(new URL("/", nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn) {
        const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";
        return Response.redirect(new URL("/vendor/login", storeUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
