import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/login"].includes(nextUrl.pathname);

    if (isApiAuthRoute) return null;

    if (isPublicRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL("/", nextUrl));
        }
        return null;
    }

    if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
    }

    return null;
});

export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
