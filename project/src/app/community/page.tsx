
import React from 'react';
import { TrendingUp, Users, Award, Lock } from 'lucide-react';
import Link from 'next/link';
import InfiniteHomePostsFeed from '@/components/community/InfinitePostsHomeFeed';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import AddPostModal from '@/components/community/AddPostModal';
import SearchCommunity from './SearchCommunity';
import SuggestedGroups from './SuggestedGroups';
export default async function GamelyCommunity() {

    const session = await auth().catch(() => null);
    const userId = session?.user?.id ?? null;


    const getposts = await prisma.post.findMany({
        take: 2,
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
                : false
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
        group: post.group
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
            AND: [{ visibility: 'VISIBLE' }, { privacy: 'PUBLIC' }],
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

    function PleaseLoginBanner({ contentType = "this content" }) {
        return (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full mb-4 border border-purple-500/30">
                    <Lock className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Please log in to  {contentType}. Join our community to unlock all features!
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition transform hover:scale-105 shadow-lg shadow-purple-500/30">
                        Login
                    </button>
                    <button className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition">
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }



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

            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3">
                        {/* Create Post Card */}
                        {
                            session ?
                                <AddPostModal />
                                :
                                <PleaseLoginBanner contentType='create post'/>
                        }


                        {/* Trending Topics */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <h3 className="mb-4 flex items-center space-x-2 text-lg font-bold">
                                <TrendingUp className="h-5 w-5 text-purple-400" />
                                <span>Trending Topics</span>
                            </h3>
                            <div className="space-y-3">
                                {
                                    topTags.map((tag) => (
                                        <Link href={`/community/hashtag_posts/${tag.name}`} key={tag.name}>
                                            <ul className='flex flex-row justify-between'>
                                                <li className='text-blue-500 cursor-pointer'>#{tag.name}</li>
                                                <li>{tag._count.posts}</li>
                                            </ul>
                                        </Link>
                                    ))
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

                    {/* Right Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3  sm:hidden">
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
                    <div className="col-span-12 space-y-6 lg:col-span-6">

                        {/* Posts */}
                        {/* {
                            loading ?
                                <div className=' flex flex-row justify-center'>
                                    <ClipLoader size={40} color='white' />
                                </div>

                                : */}
                        <>
                            <InfiniteHomePostsFeed initialPosts={posts} />

                        </>
                        {/* } */}

                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3 sm:flex flex-col hidden">
                        {/* Quick Stats */}

                        {
                            session ?
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
                                :
                                <>
                                    <PleaseLoginBanner contentType=' view tats' />

                                </>



                        }

                        {/* Suggested Groups */}
                        <SuggestedGroups groups={formattedGroups} />
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {/* {showPostModal && (
                <CreatePostModal setShowPostModal={setShowPostModal} setPosts={setPosts} />
            )} */}
        </div >
    );
}