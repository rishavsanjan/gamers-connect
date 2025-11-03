import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function GET(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const posts = await prisma.post.findMany({
            include: {
                game: {
                    select: {
                        name: true,
                        igdb_id: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        id: true,

                    }
                }
            }
        });

        const topTags = await prisma.hashtag.findMany({
            take: 5,
            orderBy: {
                posts: {
                    _count: 'desc',
                },
            },
            include: {
                _count: {
                    select: { posts: true },
                },
            },
        });

        const topUsersByPosts = await prisma.user.findMany({
            take: 5,
            orderBy: {
                Post: {
                    _count: 'desc',
                },
            },
            include: {
                _count: {
                    select: { Post: true },
                },
            },
        });


        return NextResponse.json({ posts, topTags, topUsersByPosts }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}