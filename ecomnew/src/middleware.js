import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const middleware = auth((request) => {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith("/api/auth")) return NextResponse.next();
    const session = request.auth;

    // If user is logged in, redirect away from public auth pages
    // EXCEPT for vendor auth pages if they aren't a vendor yet (allows switching)
    const publicAuthRoutes = ["/login", "/register", "/vendor/login", "/vendor/register"];
    if (publicAuthRoutes.includes(pathname)) {
        if (session) {
            const isVendorPath = pathname.startsWith("/vendor");
            if (isVendorPath && session.role !== "VENDOR") {
                // Allow them to reach vendor login/register to switch or upgrade
                return NextResponse.next();
            }
            const redirectUrl = session.role === "VENDOR" ? "/vendor" : "/";
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
    }

    // Redirect legacy admin routes to the separate port
    if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_ADMIN_URL, request.url));
    }

    // Redirect legacy vendor routes to the separate port
    // EXCEPT for the local landing, login, and register pages
    const normalizedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const localVendorRoutes = ["/vendor/login", "/vendor/register", "/vendor"];
    
    if (pathname.startsWith("/vendor") && !localVendorRoutes.includes(normalizedPath)) {
        const vendorUrl = new URL(process.env.NEXT_PUBLIC_VENDOR_URL);
        const targetUrl = new URL(pathname, vendorUrl.origin);
        return NextResponse.redirect(targetUrl);
    }

    // Customer protected routes
    const customerProtected = ["/cart", "/checkout", "/orders", "/returns"];
    if (customerProtected.some((p) => pathname.startsWith(p))) {
        if (!session) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    console.log(`[Middleware] Request: ${pathname}`);
    const result = NextResponse.next();
    
    if (pathname.startsWith("/api/auth")) {
        console.log(`[Middleware] API Auth call: ${pathname}`);
        return result;
    }

    return result;
});

export default middleware;

export const config = {
    matcher: [
        "/admin/:path*",
        "/vendor/:path*",
        "/cart",
        "/checkout/:path*",
        "/orders/:path*",
        "/returns/:path*",
    ],
};
