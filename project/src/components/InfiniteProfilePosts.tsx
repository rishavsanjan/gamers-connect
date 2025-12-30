'use client'

interface Props {
}

import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { fetchOwnPosts } from '@/app/queries/posts'
import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import { useUser } from '@/context/UserContext'
import { useProfilePostsStore } from '@/zustland/profilePostsStore'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import PostsSkeleton from './PostSkeleton'

const InfiniteProfilePosts: React.FC<Props> = () => {
    const { user } = useUser();
    if (!user) {
        return;
    }
    const userId = user?.id;
    const { setPosts } = useProfilePostsStore();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['profile-posts', userId],
        queryFn: fetchOwnPosts,
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
    const updatePost = useProfilePostsStore((s) => s.updatePost)
    const toggleBookmark = useProfilePostsStore((s) => s.toggleBookmark)
    const deletePost = useProfilePostsStore((s) => s.deletePost)
    const posts = useProfilePostsStore((s) => s.posts)
    return (
        <div>

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

export default InfiniteProfilePosts