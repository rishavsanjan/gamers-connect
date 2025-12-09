'use client'

interface Props {
    initialPosts: Post[]
}

import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import { useUser } from '@/context/UserContext'
import axios from 'axios'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'

const InfiniteProfilePosts: React.FC<Props> = ({ initialPosts }) => {
    const { user } = useUser();
    const [posts, setPosts] = useState(initialPosts)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

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

    console.log(page)
    const getPosts = async () => {
        const response = await axios({
            url: `/api/profile/profile-posts?page=${page}`,
            method: 'post',
            data: {
                userId: user?.id
            }
        });
        const newPosts = response.data.posts;
        setPosts(prev => [...prev, ...newPosts]);
        if (newPosts.length === 0) setHasMore(false);
        setLoading(false);
        console.log(response.data)

    }


    useEffect(() => {
        if (page === 1) return;
        setLoading(true);
        getPosts();


    }, [page, hasMore])

    console.log(posts)

    return (
        <div>
            <Posts posts={posts} />

            <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
                {loading && <ClipLoader color='white' size={40} />}
                {!hasMore && <p className="text-gray-500">No more posts</p>}
            </div>
        </div>
    )
}

export default InfiniteProfilePosts