import React from 'react'
import { prisma } from '@/lib/prisma'
import Posts from '@/components/community/Posts'
import { auth } from '@/auth'
import { ArrowLeft, Filter } from 'lucide-react'
import InfiniteHashTagFeed from './InfiniteHashTagFeed'

interface Props {
    params: {
        tagId: string
    }
}

const HashtagPosts: React.FC<Props> = async ({ params }) => {
    const session = await auth();

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
                            username:true,
                            avatar:true
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

    if (!hashtagPosts) {
        return
    }

    const initialPosts = hashtagPosts?.posts.map((post) => ({
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
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>
            </header>
            <div className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-white/5 px-6 py-4 backdrop-blur-lg">
                <h2 className="text-xl font-bold">Latest Posts</h2>
                <select className="cursor-pointer rounded-lg border border-purple-500/20 bg-white/10 px-4 py-2 outline-none transition hover:border-purple-500/40">
                    <option className="bg-gray-900">Latest</option>
                    <option className="bg-gray-900">Popular</option>
                    <option className="bg-gray-900">Most Liked</option>
                    <option className="bg-gray-900">Most Commented</option>
                </select>
            </div>
            <div className='flex flex-row space-x-4 mt-4'>
                <div className='w-[70%]'>
                    <InfiniteHashTagFeed tag={tag} initialPosts={initialPosts} />
                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg w-[30%]">
                    <h3 className="mb-4 text-lg font-bold">About This Hashtag</h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-300">
                        Discussion and content related to {tag}. Share your experiences, tips, strategies, and connect with other players.
                    </p>
                    <div className="space-y-3 border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Total Posts</span>
                            <span className="font-bold text-purple-400">{postCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Growth (posts in last 24 hours)</span>
                            <span className="font-bold text-green-400">{recentPostCount }</span>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default HashtagPosts