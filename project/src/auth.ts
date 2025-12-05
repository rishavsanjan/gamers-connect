import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import toast from "react-hot-toast";


export const { auth, handlers,

    signIn, signOut } = NextAuth({
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

            Google({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                profile(profile) {
                    return {
                        id: profile.sub,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        username: profile.email.split("@")[0],
                    };
                }
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
            async signIn({ user, account, profile, email, credentials }) {

                if (account?.provider === "google") {
                    // Check if a user already exists with same email but a different provider
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email! }
                    });

                    // If exists but Google account is not linked → link it
                    if (existingUser) {
                        await prisma.account.upsert({
                            where: {
                                provider_providerAccountId: {
                                    provider: account.provider,
                                    providerAccountId: account.providerAccountId
                                }
                            },
                            create: {
                                userId: existingUser.id,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                type: account.type,
                                access_token: account.access_token,
                                token_type: account.token_type,
                                id_token: account.id_token,
                                expires_at: account.expires_at,
                                scope: account.scope
                            },
                            update: {
                                access_token: account.access_token,
                                id_token: account.id_token
                            }
                        });
                    }
                }

                return true;
            },

            async jwt({ token, user }) {
                if (user) {
                    //@ts-ignore
                    token.id = user.id;
                    token.username = user.username;
                }
                return token;
            },

            async session({ session, token }) {
                session.user.id = token.id;
                session.user.username = token.username;
                return session;
            },

            async redirect({ url, baseUrl }) {
                if (url.startsWith(baseUrl)) {
                    const redirectUrl = new URL(url);
                    redirectUrl.searchParams.set("loggedIn", "true");
                    return redirectUrl.toString();
                }
                return url;
            }
        },

        pages: {
            signIn: "/auth/signin",
        },
    });