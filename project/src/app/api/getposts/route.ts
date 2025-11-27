import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 2);
    const skip = (page - 1) * limit
    const { filter, category } = await req.json();
    console.log(category)
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let posts;
        console.log(filter)
        if (filter === 'popular') {
            posts = await prisma.post.findMany({
                skip,
                take: limit,
                where: {
                    type: category
                },
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
                    },
                    Like: {
                        where: { userId: session.user.id }
                    }
                },

                orderBy: { Like: { _count: 'desc' } }

            });
        } else {
            posts = await prisma.post.findMany({
                skip,
                take: limit,
                where: {
                    type: category
                },
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
                    },
                    Like: {
                        where: { userId: session.user.id }
                    }
                },

                orderBy: { createdAt: 'desc' }

            });
        };

        if (!posts) {
            return;
        }

        const result = posts.map((post) => ({
            id: post.id,
            description: post.description,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            hasLiked: post.Like.length > 0,
            user: post.user,
            game: post.game,
            createdAt: post.createdAt,
            mediaUrls: post.mediaUrls
        }))

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

        posts.map((post) => {

        })


        return NextResponse.json({ posts: result, topTags, topUsersByPosts }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}