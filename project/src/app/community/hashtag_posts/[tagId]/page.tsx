import React from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { ArrowLeft } from 'lucide-react'
import InfiniteHashTagFeed from './InfiniteHashTagFeed'
import InitPosts from '@/context/InitPosts'
import { Metadata } from 'next'


export async function generateMetadata(
    { params }: { params: Promise<{ tagId: string }> }
): Promise<Metadata> {
    const { tagId } = await params;
    return {
        title: `${tagId}`

    };
}



export default async function HashtagPosts({ params }: { params: Promise<{ tagId: string }> }) {
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
        <div className='min-h-screen dark:bg-[#1E1538] text-white' >

            <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-black/40 backdrop-blur-md">
                <div className="flex max-w-7xl items-start justify-between px-6 py-4">
                    <a href="/community" className="flex items-start space-x-2 rounded-lg px-4 py-2 transition hover:bg-white/10">
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
            <InitPosts posts={initialPosts} />
            <InfiniteHashTagFeed tag={tag} postCount={postCount} recentPostCount={recentPostCount} />




        </div >
    )
}
