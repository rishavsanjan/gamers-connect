'use client'
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import React, { useEffect, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { fetchHomePosts } from '@/app/queries/posts'
import PostsFilterButton from '../PostsFilterButton'
import { usePostFeedStore } from '@/zustland/postFeedStore'
import PostsSkeleton from '../../skeleton/PostSkeleton'
import Lottie, { useLottie } from "lottie-react";
import animationData from '../../assets/Not Found.json'
import PostCreate from '@/app/community/PostCreate'

interface Props {
}

const InfiniteHomePostsFeed: React.FC<Props> = () => {

    const [filter, setFilter] = useState('');
    const [category, setCategory] = useState('');
    const { setPosts } = usePostFeedStore();
    const [feedType, setFeedType] = useState<'FORYOU' | 'FOLLOWING'>('FORYOU');
    const queryClient = useQueryClient();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } = useInfiniteQuery({
        queryKey: ['home-posts', filter, category, feedType],
        queryFn: fetchHomePosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 30
    });


    useEffect(() => {
        if (!data) return

        const allPosts: Post[] = data.pages.flatMap(p => p.posts)
        const uniquePosts = Array.from(
            new Map(allPosts.map(post => [post.id, post])).values()
        )

        setPosts(uniquePosts)
    }, [data, setPosts]);

    useEffect(() => {
        queryClient.removeQueries({ queryKey: ['home-posts'] });

        setPosts([])
    }, [filter, category, feedType, setPosts])

    const lastPostRef = useInfiniteScroll(isFetchingNextPage, hasNextPage ?? false, fetchNextPage);


    const updatePost = usePostFeedStore((s) => s.updatePost)
    const toggleBookmark = usePostFeedStore((s) => s.toggleBookmark)
    const deletePost = usePostFeedStore((s) => s.deletePost)
    const posts = usePostFeedStore((s) => s.posts);

    return (
        <div>
            {/* Filter Bar */}
            <PostsFilterButton category={category} filter={filter} setCategory={setCategory} setFilter={setFilter} />
            <div className='flex flex-row justify-center space-x-8 py-4'>
                <button onClick={() => { setFeedType('FORYOU') }} className={`${feedType === 'FORYOU' ? 'bg-[#A607B2] ' : 'bg-transparent text-[#A607B2] hover:text-white hover:border-white'} border-2 p-2 px-4 rounded-lg cursor-pointer border-[#A607B2] `}>For You</button>
                <button onClick={() => { setFeedType('FOLLOWING') }} className={`${feedType === 'FOLLOWING' ? 'bg-[#A607B2] ' : 'bg-transparent text-[#A607B2] hover:text-white hover:border-white'} border-2 p-2 px-4 rounded-lg cursor-pointer border-[#A607B2] `}>Following</button>
            </div>
            <div className='mt-4'>
                {
                    isLoading &&
                    <PostsSkeleton count={1} />
                }
            </div>
            <Posts actions={{ updatePost, toggleBookmark, deletePost }} posts={posts} />
            <div className='mt-4'>
                {
                    isFetchingNextPage &&
                    <PostsSkeleton count={1} />
                }
            </div>
            {
                posts.length === 0 &&
                <div className="flex flex-col items-center py-8">
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        style={{ height: 300, width: 300 }}
                    />
                    <span className='text-gray-500 text-lg font-light'>You don't have any activity yet.</span>
                    <span className='text-gray-500 text-lg font-light'>Connect with more people.</span>
                </div>
            }



            <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
                {/* {isFetchingNextPage && <ClipLoader color='white' size={40} />} */}

                {!hasNextPage && posts.length > 0 && <p className='text-gray-500 text-lg font-serif'>No more posts</p>}
            </div>
        </div>
    )
}

export default InfiniteHomePostsFeed