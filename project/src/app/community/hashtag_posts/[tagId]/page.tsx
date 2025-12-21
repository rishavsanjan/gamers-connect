import React from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { ArrowLeft, Filter } from 'lucide-react'
import InfiniteHashTagFeed from './InfiniteHashTagFeed'
import { PostFeedProvider } from '@/context/PostsContext'

interface PageProps {
    params: Promise<{ tagId: string }>
}

export default async function HashtagPosts({ params }: PageProps) {
    const session = await auth().catch(() => null);
    const userId = session?.user?.id ?? null;

    const { tagId: tag } = await params;
    const hashtagPosts = await prisma.hashtag.findUnique({
        where: { name: tag },
        include: {
            posts: {
                take: 2,
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
                    }
                    ,
                    Like: userId
                        ? { where: { userId } }
                        : false,
                    bookmarks: userId ? {
                        where: { userId },
                        select: { postId: true }
                    } : false
                },

            },

        }
    });

    if (!hashtagPosts) {
        return
    }

    const initialPosts = hashtagPosts?.posts.map((post) => ({
        id: post.id,
        description: post.description,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        hasLiked: userId ? post.Like.length > 0 : false,
        user: post.user,
        game: post.game,
        createdAt: post.createdAt,
        mediaUrls: post.mediaUrls,
        gameId: post.gameId,
        userId: post.userId,
        updatedAt: post.updatedAt,
        type: post.type,
        hasBookmarked: userId ? post.bookmarks.length > 0 : false

    }));

    const postCount = await prisma.post.count({
        where: { tags: { some: { name: tag } } }
    })

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const recentPostCount = await prisma.post.count({
        where: {
            tags: {
                some: { name: tag },
            },
            createdAt: {
                gte: twentyFourHoursAgo,
            },
        },
    })






    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' >

            <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-black/40 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <a href="/community" className="flex items-center space-x-2 rounded-lg px-4 py-2 transition hover:bg-white/10">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Community</span>
                    </a>
                    {/* <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                        </button>
                    </div> */}
                </div>
            </header>

            <PostFeedProvider initialPosts={initialPosts}>
                <InfiniteHashTagFeed tag={tag}  postCount={postCount} recentPostCount={recentPostCount} />
            </PostFeedProvider>




        </div >
    )
}
