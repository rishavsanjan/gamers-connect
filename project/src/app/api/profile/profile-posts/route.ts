import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 5)
    const skip = (page - 1) * limit

    try {


        const { userId } = await req.json();

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
            where:{
                userId
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
                        username: true,
                        avatar: true
                    }
                },
                Like: {
                    where: { userId: userId }
                },
                bookmarks: {
                    where: { userId: userId },
                    select: { postId: true }
                }
            },

        });

        const result = posts.map((post) => ({
            id: post.id,
            description: post.description,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            hasLiked: post.Like.length > 0,
            user: post.user,
            game: post.game,
            createdAt: post.createdAt,
            mediaUrls: post.mediaUrls,
            gameId: post.gameId,
            userId: post.userId,
            updatedAt: post.updatedAt,
            type: post.type,
            hasBookmarked: post.bookmarks.length > 0 || false,
            viewCount : post.viewCount

        }))




        return NextResponse.json({ posts: result }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}