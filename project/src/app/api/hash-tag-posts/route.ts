import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tag = searchParams.get('tag');
        const page = Number(searchParams.get('page') || 1)
        const limit = Number(searchParams.get('limit') || 2)
        const skip = (page - 1) * limit

        if (!tag) {
            return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
        }

        let { filter, category } = await req.json();
        if (category === 'ALL') {
            category = '';
        }
        const session = await auth().catch(() => null);
        const userId = session?.user?.id;

        const whereClause: any = category ? { type: category } : {};

        const hashtag = await prisma.hashtag.findUnique({
            where: { name: tag },
            include: {
                posts: {
                    skip,
                    take: limit,
                    where: whereClause,
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
                        Like: userId ? {
                            where: { userId }
                        } : false,
                        bookmarks: userId ? {
                            where: { userId },
                            select: { postId: true }
                        } : false
                    },
                    orderBy: filter === 'popular'
                        ? { Like: { _count: 'desc' } }
                        : { createdAt: 'desc' }
                },
            },
        });

        if (!hashtag) {
            return NextResponse.json({ posts: [] })
        }

        const posts = hashtag.posts.map(post => ({
            id: post.id,
            description: post.description,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            hasLiked: Array.isArray(post.Like) && post.Like.length > 0,
            user: post.user,
            game: post.game,
            createdAt: post.createdAt,
            mediaUrls: post.mediaUrls,
            gameId: post.gameId,
            userId: post.userId,
            updatedAt: post.updatedAt,
            type: post.type,
            hasBookmarked: userId && Array.isArray(post.bookmarks) && post.bookmarks.length > 0,
            viewCount : post.viewCount
        }))

        return NextResponse.json({ posts })

    } catch (error) {
        console.error('Error fetching hashtag posts:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}