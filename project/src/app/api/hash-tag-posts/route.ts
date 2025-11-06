import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export  async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tag = searchParams.get('tag');
        const page = Number(searchParams.get('page') || 1)
        const limit = Number(searchParams.get('limit') || 2)
        const skip = (page - 1) * limit
        if (!tag) {
            return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
        }

        const session = await auth();
        console.log(tag, page, limit, skip)
        const hashtag = await prisma.hashtag.findUnique({
            where: { name: tag },
            include: {
                posts: {
                    skip,
                    take: limit,
                    include: {
                        user: {
                            select: {
                                name: true,
                                id: true
                            }
                        },
                        game: {
                            select: {
                                name: true,
                                igdb_id: true
                            }
                        }
                        ,
                        Like: {
                            where: { userId: session?.user.id }
                        }
                    },

                },

            }
        });

        if (!hashtag) {
            return NextResponse.json({ posts: [] })
        }

        const posts = hashtag.posts.map(post => ({
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
        }))

        return NextResponse.json({ posts })

    } catch (error) {
        console.log(error)
    }
}