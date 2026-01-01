'use client'
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchHomePosts } from '@/app/queries/posts'
import PostsFilterButton from '../PostsFilterButton'
import { usePostFeedStore } from '@/zustland/postFeedStore'
import PostsSkeleton from '../../skeleton/PostSkeleton'


interface Props {
}

const InfiniteHomePostsFeed: React.FC<Props> = () => {

    const [filter, setFilter] = useState('');
    const [category, setCategory] = useState('');
    const { setPosts } = usePostFeedStore();


    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['home-posts', filter, category],
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
    }, [data, setPosts])

    const lastPostRef = useInfiniteScroll(isFetchingNextPage, hasNextPage ?? false, fetchNextPage);


    const updatePost = usePostFeedStore((s) => s.updatePost)
    const toggleBookmark = usePostFeedStore((s) => s.toggleBookmark)
    const deletePost = usePostFeedStore((s) => s.deletePost)
    const posts = usePostFeedStore((s) => s.posts);

    return (
        <div>
            {/* Filter Bar */}
            <PostsFilterButton category={category} filter={filter} setCategory={setCategory} setFilter={setFilter} />
            <Posts actions={{ updatePost, toggleBookmark, deletePost }} posts={posts} />
            <div className='mt-4'>
                {
                    isFetchingNextPage &&
                    <PostsSkeleton count={1} />
                }
            </div>


            <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
                {/* {isFetchingNextPage && <ClipLoader color='white' size={40} />} */}

                {!hasNextPage && <p className="text-gray-500">No more posts</p>}
            </div>
        </div>
    )
}

export default InfiniteHomePostsFeed