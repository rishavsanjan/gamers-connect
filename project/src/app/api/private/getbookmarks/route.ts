import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 1)
    const skip = (page - 1) * limit

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const bookmarks = await prisma.bookmark.findMany({
            take: limit,
            skip,
            where: {
                userId: session.user.id
            },
            select: {
                post: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                id: true,
                                username: true,
                                avatar: true
                            }
                        },
                        game: {
                            select: {
                                name: true,
                                igdb_id: true
                            }
                        },
                        Like: {
                            where: { userId: session.user.id }
                        },
                        bookmarks: {
                            where: { userId: session.user.id },
                            select: { postId: true }
                        }
                    },



                },

            }
        })

        const bookmarkedPosts = bookmarks.map((post) => {
            return {
                id: post.post.id,
                description: post.post.description,
                likeCount: post.post.likeCount,
                commentCount: post.post.commentCount,
                hasLiked: post.post.Like.length > 0,
                user: post.post.user,
                game: post.post.game,
                createdAt: post.post.createdAt,
                mediaUrls: post.post.mediaUrls,
                userId: post.post.userId,
                type: post.post.type,
                updatedAt: post.post.updatedAt,
                gameId: post.post.gameId,
                hasBookmarked: post.post.bookmarks.length > 0 || false,
                viewCount:post.post.viewCount

            };
        })


        return NextResponse.json({ posts: bookmarkedPosts }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}