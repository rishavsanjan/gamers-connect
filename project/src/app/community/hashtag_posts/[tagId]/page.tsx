import React from 'react'
import { prisma } from '@/lib/prisma'
import Posts from '@/components/community/Posts'
import { auth } from '@/auth'
import { ArrowLeft, Filter } from 'lucide-react'

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

    if(!hashtagPosts){
        return
    }

    const posts = hashtagPosts?.posts.map((post) => ({
        id: post.id,
        description: post.description,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        hasLiked: post.Like.length > 0,
        user: post.user,
        game: post.game,
        createdAt: post.createdAt,
        mediaUrls: post.mediaUrls,
        gameId:post.gameId,
        userId:post.userId,
        updatedAt:post.updatedAt,
        type:post.type,
    }))



    console.log(hashtagPosts)



    return (
        <div>
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
            <Posts posts={posts} />
        </div>
    )
}

export default HashtagPosts