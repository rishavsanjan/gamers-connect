'use client'

interface Props {
}

import Posts from '@/components/community/Posts'
import { usePostFeed } from '@/context/PostsContext'
import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'

const InfiniteProfileBookmarked: React.FC<Props> = ({  }) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const {posts, setPosts} = usePostFeed();

    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostRef = useCallback((node: HTMLDivElement) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1)
            }
        })

        if (node) observer.current.observe(node)
    }, []);

    const getPosts = async () => {
        const response = await axios({
            url: `/api/private/getbookmarks?page=${page}`,
            method: 'get'
        });
        const newPosts = response.data.posts;
        setPosts(prev => [...prev, ...newPosts]);
        if (newPosts.length === 0) setHasMore(false);
        setLoading(false);

    }


    useEffect(() => {
        if (page === 1) return;
        setLoading(true);
        getPosts();


    }, [page, hasMore])


    return (
        <div>
            <Posts />

            <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
                {loading && <ClipLoader color='white' size={40} />}
                {!hasMore && <p className="text-gray-500">No more posts</p>}
            </div>
        </div>
    )
}

export default InfiniteProfileBookmarked