'use client'

import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { fetchHashTagPosts } from '@/app/queries/posts'
import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import PostsFilterButton from '@/components/PostsFilterButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePostFeed } from '@/context/PostsContext'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Filter } from 'lucide-react'
import React, {  useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

interface Props {
    tag: string,
    postCount: number,
    recentPostCount: number
}

const InfiniteHashTagFeed: React.FC<Props> = ({ tag, postCount, recentPostCount }) => {
    const [filter, setFilter] = useState('latest')
    const [category, setCategory] = useState('')

    const { posts, setPosts } = usePostFeed();

     const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['hashtag-posts',filter, category, tag],
        queryFn: fetchHashTagPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 30
    });

    useEffect(() => {
        if (!data) return

        const allPosts: Post[] = data.pages.flatMap(p => p.posts)
        setPosts(allPosts)
    }, [data, setPosts])

    const lastPostRef = useInfiniteScroll(isFetchingNextPage, hasNextPage ?? false, fetchNextPage);

    return (
        <div>
            <PostsFilterButton category={category} filter={filter} setCategory={setCategory} setFilter={setFilter}/>
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
                        {isFetchingNextPage && <ClipLoader color='white' size={40} />}
                        {!hasNextPage && posts.length > 0 && <p className="text-gray-500">No more posts</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfiniteHashTagFeed