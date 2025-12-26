
import React from 'react';
import { Users } from 'lucide-react';
import InfiniteHomePostsFeed from '@/components/community/InfinitePostsHomeFeed';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import AddPostModal from '@/components/community/AddPostModal';
import SearchCommunity from './SearchCommunity';
import SuggestedGroups from './SuggestedGroups';
import { PostFeedProvider } from '@/context/PostsContext';
import UserStats from './UserStats';
import TopUsers from './TopUsers';
import TrendingTags from './TrendingTags';

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

    //const topTags = await getTopTags();

    const tags = topTags?.map((tag) => ({
        name: tag.name,
        tagCount: tag._count.posts,
        id: tag.id
    }))

    console.log(tags)


    const topUsers = await prisma.user.findMany({
        take: 5,
        orderBy: {
            Post: {
                _count: 'desc',
            },
        },
        select: {
            _count: {
                select: { Post: true },
            },
            id: true,
            username: true,
            avatar: true,
            xp: true
        },
    });

    const topGamers = topUsers.map((user) => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        xp: user.xp,
        postCount: user._count.Post
    }))

    console.log(topGamers)

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
    console.log(session?.user.id)
    const suggestedGroups = await prisma.group.findMany({
        take: 3,
        where: {
            visibility: 'VISIBLE',
            privacy: { in: ['PUBLIC', 'PRIVATE'] },
            NOT: [
                {
                    OR: [
                        { members: { some: { id: session?.user.id } } },
                        { groupJoinRequests: { some: { user: { id: session?.user.id } } } },
                    ],
                },
            ],
        },
    });

    const formattedGroups = suggestedGroups.map((group) => {
        return {
            ...group,
            hasJoined: false
        }
    })





    return (
        <div className="bg-gray-100 dark:bg-[#0F0B1E] text-gray-800 dark:text-gray-100 font-sans h-full  flex flex-col transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-purple-500/20 bg-black/40 backdrop-blur-md ">
                <div className="mx-auto flex max-w-7xl items-center justify-between sm:px-6 px-1 py-4 space-x-4 ">
                    <div className="flex items-center space-x-8">
                        <h1 className="flex items-center space-x-2 sm:text-2xl text-lg font-bold">
                            <Users className="sm:h-6 h-5 sm:w-6  text-purple-400" />
                            <span>Community</span>
                        </h1>

                    </div>
                    <SearchCommunity />
                </div>
            </header>

            <div className="mx-auto max-w-7xl md:px-6  flex ">

                <div className="grid grid-cols-12 gap-6 px-2">
                    {/* Left Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3 py-4">
                        {/* Create Post Card */}
                        <PostFeedProvider initialPosts={posts}>
                            <AddPostModal />
                        </PostFeedProvider>




                        {/* Trending Topics */}
                        <TrendingTags topTags={tags} />

                        {/* Top Gamers */}
                        <TopUsers topGamers={topGamers} />
                    </div>

                    {/* Right Sidebar for samll screens */}
                    <div className="col-span-12  lg:col-span-3 space-y-4 lg:hidden ">
                        {/* Quick Stats */}
                        <UserStats postCount={myStats[0]._count.Post} followers={myStats[0]._count.followers} xp={myStats[0].xp} />


                        {/* Suggested Groups */}
                        <SuggestedGroups groups={formattedGroups} />
                    </div>

                    {/* Main Feed */}
                    <div className="col-span-12  lg:col-span-6 md:overflow-y-auto pt-4 hide-scrollbar h-screen">
                        <PostFeedProvider initialPosts={posts}>
                            <InfiniteHomePostsFeed />
                        </PostFeedProvider>
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3 lg:flex flex-col hidden sticky py-4">
                        {/* Quick Stats */}
                        <UserStats postCount={myStats[0]._count.Post} followers={myStats[0]._count.followers} xp={myStats[0].xp} />


                        {/* Suggested Groups */}
                        <SuggestedGroups groups={formattedGroups} />
                    </div>
                </div>
            </div>
        </div >
    );
}