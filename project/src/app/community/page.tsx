
import React from 'react';
import { TrendingUp, Users, Award, Lock } from 'lucide-react';
import Link from 'next/link';
import InfiniteHomePostsFeed from '@/components/community/InfinitePostsHomeFeed';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import AddPostModal from '@/components/community/AddPostModal';
import SearchCommunity from './SearchCommunity';
import SuggestedGroups from './SuggestedGroups';
import { PostFeedProvider } from '@/context/PostsContext';
import { getTopTags } from '@/lib/topTags';
export default async function GamelyCommunity() {

    const session = await auth().catch(() => null);
    const userId = session?.user?.id ?? null;

    let followingUserIds;
    let joinedGroupIds;

    if (userId) {
        const followingIds = await prisma.follow.findMany({
            where: { followerId: userId },
            select: {
                followingId: true
            }
        });

        const groupIds = await prisma.user.findMany({
            where: { id: userId },
            include: {
                memberInGroups: {
                    select: {
                        id: true
                    }
                }
            }
        })

        followingUserIds = followingIds.map(f => f.followingId)
        joinedGroupIds = groupIds.map(f => f.memberInGroups.map(f => f.id)).flat()
        console.log(followingUserIds)
        console.log(joinedGroupIds)
    }


    const getposts = await prisma.post.findMany({
        take: 2,
        where:
            userId ? {
                OR: [
                    {
                        userId: { in: followingUserIds }
                    },
                    {
                        groupId: { in: joinedGroupIds }
                    },
                    {
                        visibility: 'EVERYONE'
                    },
                    {
                        userId
                    }
                ]


            } : {
                OR: [
                    {
                        visibility: 'EVERYONE'
                    }
                ]
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
            group: {
                select: { name: true, id: true }
            },
            Like: userId
                ? { where: { userId } }
                : false,
            bookmarks: userId ? {
                where: { userId },
                select: { postId: true }
            } : false
        },

        orderBy: { createdAt: 'desc' }

    });

    console.log(getposts)

    const posts = getposts.map((post) => ({
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
        group: post.group,
        hasBookmarked: userId ? post.bookmarks.length > 0 : false
    }));

    console.log(posts)


    // const topTags = await prisma.hashtag.findMany({
    //     take: 5,
    //     orderBy: {
    //         posts: {
    //             _count: 'desc',
    //         },
    //     },
    //     include: {
    //         _count: {
    //             select: { posts: true },
    //         },
    //     },
    // });

    const topTags = await getTopTags();
    console.log(topTags)


    const topUsers = await prisma.user.findMany({
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

    const myStats = await prisma.user.findMany({
        where: {
            id: session?.user.id
        },
        select: {
            _count: {
                select: { Post: true, followers: true }
            },
            xp: true
        }
    })

    const suggestedGroups = await prisma.group.findMany({
        take: 3,
        where: {
            AND: [{ visibility: 'VISIBLE' }, { OR: [{ privacy: 'PUBLIC' }, { privacy: 'PRIVATE' }] }],
            NOT: {
                members: { some: { id: session?.user.id } }
            }
        },


    })

    const formattedGroups = suggestedGroups.map((group) => {
        return {
            ...group,
            hasJoined: false
        }
    })
    console.log(getposts)





    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white z-0">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-purple-500/20 bg-black/40 backdrop-blur-md ">
                <div className="mx-auto flex max-w-7xl items-center justify-between sm:px-6 px-1 py-4 space-x-4 ">
                    <div className="flex items-center space-x-8">
                        <h1 className="flex items-center space-x-2 sm:text-2xl text-lg font-bold">
                            <Users className="sm:h-6 h-5 sm:w-6 h-5 text-purple-400" />
                            <span>Community</span>
                        </h1>

                    </div>
                    <SearchCommunity />
                </div>
            </header>

            <div className="mx-auto max-w-7xl md:px-6  flex h-screen">

                <div className="grid grid-cols-12 gap-6 px-2">
                    {/* Left Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3 py-4">
                        {/* Create Post Card */}
                        <AddPostModal />


                        {/* Trending Topics */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <h3 className="mb-4 flex items-center space-x-2 text-lg font-bold">
                                <TrendingUp className="h-5 w-5 text-purple-400" />
                                <span>Trending Topics</span>
                            </h3>
                            <div className="space-y-3">
                                {
                                    topTags?.map((tag) => (
                                        <Link href={`/community/hashtag_posts/${tag.name}`} key={tag.name}>
                                            <ul className='flex flex-row justify-between'>
                                                <li className='text-blue-500 cursor-pointer'>#{tag.name}</li>
                                                <li>{tag._count.posts}</li>
                                            </ul>
                                        </Link>
                                    )) || 'No top tags!'
                                }
                            </div>
                        </div>

                        {/* Top Gamers */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <h3 className="mb-4 flex items-center space-x-2 text-lg font-bold">
                                <Award className="h-5 w-5 text-yellow-400" />
                                <span>Top Gamers</span>
                            </h3>
                            <div className="space-y-3">
                                {
                                    topUsers.map((user) => (
                                        <Link href={`/player-profile/${user.id}`} key={user.id}>
                                            <ul key={user.id} className='flex flex-row justify-between'>
                                                <li className='text-blue-500 cursor-pointer'>@{user.username || 'Anynomus'}</li>
                                                {/* @ts-ignore */}
                                                <li>{user._count.Post}</li>

                                            </ul>
                                        </Link>


                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar for samll screens */}
                    <div className="col-span-12  lg:col-span-3  sm:hidden ">
                        {/* Quick Stats */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <h3 className="mb-4 text-lg font-bold">Your Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Posts</span>
                                    <span className="font-bold text-purple-400">{myStats[0]._count.Post}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Followers</span>
                                    <span className="font-bold text-purple-400">{myStats[0]._count.followers}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">XP</span>
                                    <span className="font-bold text-purple-400">{myStats[0].xp}</span>
                                </div>
                            </div>
                        </div>

                        {/* Suggested Groups */}
                        <SuggestedGroups groups={formattedGroups} />
                    </div>

                    {/* Main Feed */}
                    <div className="col-span-12 space-y-6 lg:col-span-6 md:overflow-y-auto py-4 hide-scrollbar">
                        <PostFeedProvider initialPosts={posts}>
                            <InfiniteHomePostsFeed />
                        </PostFeedProvider>
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3 sm:flex flex-col hidden sticky py-4">
                        {/* Quick Stats */}

                        < div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <h3 className="mb-4 text-lg font-bold">Your Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Posts</span>
                                    <span className="font-bold text-purple-400">{myStats[0]._count.Post}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Followers</span>
                                    <span className="font-bold text-purple-400">{myStats[0]._count.followers}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">XP</span>
                                    <span className="font-bold text-purple-400">{myStats[0].xp}</span>
                                </div>
                            </div>
                        </div>


                        {/* Suggested Groups */}
                        <SuggestedGroups groups={formattedGroups} />
                    </div>
                </div>
            </div>
        </div >
    );
}