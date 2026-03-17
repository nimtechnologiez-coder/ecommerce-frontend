import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    basePath: "/api/auth",
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const bcrypt = await import("bcryptjs");
                const dbConnect = (await import("@/lib/db")).default;
                const User = (await import("@/lib/models/User")).default;
                
                await dbConnect();
                const user = await User.findOne({ email: credentials.email });
                if (!user) return null;
                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) return null;

                // Update last login
                user.lastLogin = new Date();
                await user.save();

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: { strategy: "jwt" },
    trustHost: true,

    secret: process.env.AUTH_SECRET,
    debug: true,
});
