'use client';

import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, Users, Award, Image, Video, FileText, Send, Filter, Search } from 'lucide-react';
import CreatePostModal from '@/components/community/CreatePost';
import { Post } from '../types/post';
import axios from 'axios';
import { timeAgo } from '../utils/date';
import Link from 'next/link';
import { HashTag } from '../types/post';
import { User } from '@prisma/client';
export default function GamelyCommunity() {
    const [showPostModal, setShowPostModal] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [topTags, setTopTags] = useState<HashTag[]>([]);
    const [topUsers, setTopUsers] = useState<User[]>([]);

    const getGames = async () => {
        const response = await axios({
            url: `/api/private/getposts`,
            method: 'get',

        })
        console.log(response.data)
        setPosts(response.data.posts)
        setTopTags(response.data.topTags)
        setTopUsers(response.data.topUsersByPosts);
    }

    useEffect(() => {
        getGames();
    }, []);

    console.log(posts)


    // const handleLike = (postId: number) => {
    //     setPosts(posts.map(post =>
    //         post.id === postId ? { ...post, likes: post.likes + 1 } : post
    //     ));
    // };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-black/40 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-8">
                        <h1 className="flex items-center space-x-2 text-2xl font-bold">
                            <Users className="h-6 w-6 text-purple-400" />
                            <span>Community</span>
                        </h1>

                    </div>
                    <button className="flex items-center space-x-2 rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20">
                        <Search className="h-4 w-4" />
                        <span>Search</span>
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3">
                        {/* Create Post Card */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <button
                                onClick={() => setShowPostModal(true)}
                                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold transition hover:from-purple-700 hover:to-pink-700"
                            >
                                <Send className="h-5 w-5" />
                                <span>Create Post</span>
                            </button>
                        </div>

                        {/* Trending Topics */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <h3 className="mb-4 flex items-center space-x-2 text-lg font-bold">
                                <TrendingUp className="h-5 w-5 text-purple-400" />
                                <span>Trending Topics</span>
                            </h3>
                            <div className="space-y-3">
                                {
                                    topTags.map((tag) => (
                                        <ul className='flex flex-row justify-between'>
                                            <li className='text-blue-500 cursor-pointer'>#{tag.name}</li>
                                            <li>{tag._count.posts}</li>
                                        </ul>
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
                                        <ul className='flex flex-row justify-between'>
                                            <li className='text-blue-500 cursor-pointer'>@{user.name}</li>
                                            {/* @ts-ignore */}
                                            <li>{user._count.Post}</li>
                                        </ul>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <div className="col-span-12 space-y-6 lg:col-span-6">
                        {/* Filter Bar */}
                        <div className="flex items-center space-x-4 rounded-2xl border border-purple-500/20 bg-white/5 p-4 backdrop-blur-lg">
                            <Filter className="h-5 w-5 text-purple-400" />
                            <select className="flex-1 cursor-pointer border-none bg-transparent outline-none">
                                <option className="bg-gray-900">All Games</option>
                                <option className="bg-gray-900">Elden Ring</option>
                                <option className="bg-gray-900">Valorant</option>
                                <option className="bg-gray-900">Stardew Valley</option>
                            </select>
                            <select className="cursor-pointer border-none bg-transparent outline-none">
                                <option className="bg-gray-900">Latest</option>
                                <option className="bg-gray-900">Popular</option>
                                <option className="bg-gray-900">Trending</option>
                            </select>
                        </div>

                        {/* Posts */}
                        {posts.map(post => (
                            <div key={post.id} className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg transition hover:border-purple-500/40">
                                {/* Post Header */}
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl">
                                            <img className='w-8 h-8' src="https://img.icons8.com/?size=100&id=7rcs0z3sdioE&format=png&color=000000" alt="" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{post.user.name}</p>
                                            <p className="text-sm text-gray-400">
                                                {
                                                    post.game &&
                                                    <>
                                                        {/* @ts-ignore */}
                                                        <Link href={`/details/${post.game.igdb_id}`} key={post.game.igdb_id}>
                                                            <span className="text-purple-400">{post.game.name}</span>
                                                        </Link>
                                                    </>
                                                }

                                                {' '}  • {timeAgo(post.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                {/* Post Content */}
                                <p className="mb-4 leading-relaxed text-gray-200">{post.description}</p>

                                {/* Post Image Placeholder */}
                                {post.mediaUrls.length > 0 && (
                                    <div className="mb-4 flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-6xl">
                                        {
                                            post.mediaUrls.map((image) => (
                                                <img src={`${image}`} alt="" />
                                            ))
                                        }
                                    </div>
                                )}

                                {/* Post Actions */}
                                <div className="flex items-center space-x-6 border-t border-white/10 pt-4">
                                    <button
                                        // onClick={() => handleLike(post.id)}
                                        className="flex items-center space-x-2 text-gray-400 transition hover:text-pink-500"
                                    >
                                        <Heart className="h-5 w-5" />
                                        <span>{post.likeCount}</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-400 transition hover:text-purple-400">
                                        <MessageCircle className="h-5 w-5" />
                                        <span>{post.commentCount}</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-400 transition hover:text-blue-400">
                                        <Share2 className="h-5 w-5" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-3">
                        {/* Quick Stats */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <h3 className="mb-4 text-lg font-bold">Your Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Posts</span>
                                    <span className="font-bold text-purple-400">42</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Followers</span>
                                    <span className="font-bold text-purple-400">1.2k</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Reputation</span>
                                    <span className="font-bold text-purple-400">847</span>
                                </div>
                            </div>
                        </div>

                        {/* Suggested Groups */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
                            <h3 className="mb-4 text-lg font-bold">Suggested Groups</h3>
                            <div className="space-y-3">
                                {['RPG Lovers', 'FPS Masters', 'Indie Games'].map((group, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-lg p-3 transition hover:bg-white/10">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                                            <div>
                                                <p className="text-sm font-medium">{group}</p>
                                                <p className="text-xs text-gray-400">{Math.floor(Math.random() * 5000 + 1000)} members</p>
                                            </div>
                                        </div>
                                        <button className="rounded-lg bg-purple-600 px-3 py-1 text-sm transition hover:bg-purple-700">
                                            Join
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {showPostModal && (
                <CreatePostModal setShowPostModal={setShowPostModal} setPosts={setPosts} />
            )}
        </div>
    );
}