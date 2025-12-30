'use client'

interface Props {
}

import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { fetchBookmarkedPosts } from '@/app/queries/posts'
import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import { useProfileBookmarkStore } from '@/zustland/profileBookmarkStore'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, {  useEffect } from 'react'
import { ClipLoader } from 'react-spinners'

const InfiniteProfileBookmarked: React.FC<Props> = ({ }) => {

    const { setPosts } = useProfileBookmarkStore();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['bookmarked-posts'],
        queryFn: fetchBookmarkedPosts,
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

    const updatePost = useProfileBookmarkStore((s) => s.updatePost)
    const toggleBookmark = useProfileBookmarkStore((s) => s.toggleBookmark)
    const deletePost = useProfileBookmarkStore((s) => s.deletePost)
    const posts = useProfileBookmarkStore((s) => s.posts);

    return (
        <div>
            <Posts actions={{ updatePost, toggleBookmark, deletePost }} posts={posts}/>

            <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
                {isFetchingNextPage || isLoading && <ClipLoader color='white' size={40} />}
                {!hasNextPage  && <p className="text-gray-500">No more posts</p>}
            </div>
        </div>
    )
}

export default InfiniteProfileBookmarked