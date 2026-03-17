import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                await dbConnect();
                const user = await User.findOne({ email: credentials.email });

                // Only allow ADMIN role
                if (!user || user.role !== "ADMIN") return null;

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
    secret: process.env.AUTH_SECRET,
    trustHost: true,
});
