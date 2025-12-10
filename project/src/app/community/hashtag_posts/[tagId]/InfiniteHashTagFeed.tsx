'use client'

import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import { usePostFeed } from '@/context/PostsContext'
import axios from 'axios'
import { Filter } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'

interface Props {
    tag: string,
    postCount: number,
    recentPostCount: number
}

const InfiniteHashTagFeed: React.FC<Props> = ({ tag, postCount, recentPostCount }) => {
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [filter, setFilter] = useState('latest')
    const [category, setCategory] = useState('')

    const { posts, setPosts } = usePostFeed();

    const observer = useRef<IntersectionObserver | null>(null);
    const isFetchingRef = useRef(false);

    const lastPostRef = useCallback((node: HTMLDivElement) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
                setPage(prev => prev + 1)
            }
        })

        if (node) observer.current.observe(node)
    }, [loading, hasMore]);

    const getPosts = useCallback(async (pageNum: number, isReset = false) => {
        if (isFetchingRef.current) return;

        isFetchingRef.current = true;
        setLoading(true)

        try {
            const response = await axios.post(
                `/api/hash-tag-posts?tag=${encodeURIComponent(tag)}&page=${pageNum}`,
                { filter, category }
            );
            const newPosts = response.data.posts;

            if (isReset) {
                setPosts(newPosts)
            } else {
                setPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNewPosts = newPosts.filter((post: Post) => !existingIds.has(post.id));
                    return [...prev, ...uniqueNewPosts];
                })
            }

            setHasMore(newPosts.length > 0);
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
            isFetchingRef.current = false;
        }
    }, [tag, filter, category]);

    // Handle infinite scroll
    useEffect(() => {
        if (page > 1) {
            getPosts(page);
        }
    }, [page]);

    // Handle filter/category changes
    useEffect(() => {
        setPosts([]);
        setHasMore(true);
        setPage(1);
        getPosts(1, true);
    }, [filter, category]);

    return (
        <div>
            <div className="flex items-center justify-between rounded-xl border m-4 border-purple-500/20 bg-white/5 px-6 py-4 backdrop-blur-lg">
                <Filter className="h-5 w-5 text-purple-400" />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 cursor-pointer border-none bg-transparent outline-none"
                >
                    <option value={''} className="bg-gray-900">All</option>
                    <option value={'QUERY'} className="bg-gray-900">QUERY</option>
                    <option value={'REVIEW'} className="bg-gray-900">REVIEW</option>
                    <option value={'SCREENSHOT'} className="bg-gray-900">SCREENSHOT</option>
                    <option value={'NEWS'} className="bg-gray-900">NEWS</option>
                    <option value={'GUIDE'} className="bg-gray-900">GUIDE</option>
                    <option value={'HELP'} className="bg-gray-900">HELP</option>
                </select>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="cursor-pointer rounded-lg border border-purple-500/20 bg-white/10 px-4 py-2 outline-none transition hover:border-purple-500/40"
                >
                    <option value={'latest'} className="bg-gray-900">Latest</option>
                    <option value={'popular'} className="bg-gray-900">Popular</option>
                </select>
            </div>
            <div className='flex md:flex-row flex-col space-x-4 mt-4 m-4 gap-2'>
                <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg md:w-[30%] w-full">
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
                            <span className="font-bold text-green-400">{recentPostCount}</span>
                        </div>
                    </div>
                </div>
                <div className='md:w-[70%] w-full'>
                    <Posts />

                    <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
                        {loading && <ClipLoader color='white' size={40} />}
                        {!hasMore && posts.length > 0 && <p className="text-gray-500">No more posts</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfiniteHashTagFeed