'use client'

interface Props {
}

import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { fetchOwnPosts } from '@/app/queries/posts'
import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import { usePostFeed } from '@/context/PostsContext'
import { useUser } from '@/context/UserContext'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'

const InfiniteProfilePosts: React.FC<Props> = () => {
    const { user } = useUser();
    if (!user) {
        return;
    }
    const userId = user?.id;
    const { setPosts } = usePostFeed();

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


    return (
        <div>

            <Posts />

            <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
                {isFetchingNextPage && <ClipLoader color='white' size={40} />}
                {!hasNextPage && <p className="text-gray-500">No more posts</p>}
            </div>
        </div>
    )
}

export default InfiniteProfilePosts