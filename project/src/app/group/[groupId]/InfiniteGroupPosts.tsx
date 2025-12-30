'use client'

import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { fetchGroupPosts } from '@/app/queries/posts'
import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import PostsFilterButton from '@/components/PostsFilterButton'
import PostsSkeleton from '@/components/PostSkeleton'
import { useGroupPostsStore } from '@/zustland/groupPostsStore'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

interface Props {
    groupId: string
}

const InfiniteGroupPosts: React.FC<Props> = ({ groupId }) => {


    const [filter, setFilter] = useState('');
    const [category, setCategory] = useState('');

    const { setPosts } = useGroupPostsStore();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['group-posts', groupId, filter, category],
        queryFn: fetchGroupPosts,
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
    const updatePost = useGroupPostsStore((s) => s.updatePost)
    const toggleBookmark = useGroupPostsStore((s) => s.toggleBookmark)
    const deletePost = useGroupPostsStore((s) => s.deletePost)
    const posts = useGroupPostsStore((s) => s.posts);
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

export default InfiniteGroupPosts