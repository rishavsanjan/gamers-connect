import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: {
        ...PrismaAdapter(prisma),
        async createUser(data) {
            const { emailVerified, ...userData } = data;

            // Generate username from email or name
            const username = userData.email?.split("@")[0] ||
                userData.name?.toLowerCase().replace(/\s+/g, "") ||
                `user${Date.now()}`;

            return prisma.user.create({
                data: {
                    ...userData,
                    username,
                    emailVerified: emailVerified || null,
                },
            });
        },
    },

    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    username: profile.login,
                };
            },
        }),

        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text" },
            },
            async authorize(credentials) {
                if (
                    !credentials ||
                    typeof credentials.email !== "string" ||
                    typeof credentials.password !== "string"
                ) {
                    return null;
                }

                const email = credentials.email;
                const password = credentials.password;
                const username =
                    typeof credentials.username === "string" && credentials.username.trim() !== ""
                        ? credentials.username
                        : email.split("@")[0];

                let user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    const hashed = await bcrypt.hash(password, 10);
                    user = await prisma.user.create({
                        data: {
                            email,
                            password: hashed,
                            username,
                            name: username,
                        },
                    });
                } else {
                    if (!user.password) throw new Error("User has no password set");
                    const isValid = await bcrypt.compare(password, user.password);
                    if (!isValid) throw new Error("Invalid credentials");
                }

                return user;
            }
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id!;
                token.username = user.username;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/signin",
    },
});