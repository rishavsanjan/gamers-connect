'use client'



import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import { PostFeedProvider, usePostFeed } from '@/context/PostsContext'
import axios from 'axios'
import { Filter } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'

interface Props {
}

const InfiniteHomePostsFeed: React.FC<Props> = () => {
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [filter, setFilter] = useState('');
    const [category, setCategory] = useState('');
    const { setPosts } = usePostFeed();

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
    }, [loading, hasMore]);

    const getPosts = async () => {
        setLoading(true);
        try {
            const response = await axios({
                url: `/api/getposts?page=${page}`,
                method: 'post',
                data: { filter, category }
            });

            const newPosts = response.data.posts;
            console.log(newPosts)
            if (page === 1) {
                setPosts(newPosts);
            } else {
                setPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNewPosts = newPosts.filter((post: Post) => !existingIds.has(post.id));
                    return [...prev, ...uniqueNewPosts];
                });
            }

            if (newPosts.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        setPosts([]);
        setHasMore(true);
        setPage(1);

        (async () => {
            setLoading(true);
            try {
                const response = await axios({
                    url: `/api/getposts?page=1`,
                    method: 'post',
                    data: { filter, category }
                });

                console.log(category)
                const newPosts = response.data.posts;
                console.log(newPosts)
                setPosts(newPosts);

                if (newPosts.length === 0) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [filter, category]);



    useEffect(() => {
        if (page === 1) return;

        getPosts();
    }, [page]);

    return (
        <div>
            {/* Filter Bar */}
            <div className="flex items-center space-x-4 rounded-2xl border border-purple-500/20 bg-white/5 p-4 backdrop-blur-lg mb-4">
                <Filter className="h-5 w-5 text-purple-400" />
                <select onChange={(e) => setCategory(e.target.value)} className="flex-1 cursor-pointer border-none bg-transparent outline-none">
                    <option value={''} className="bg-gray-900">All</option>
                    <option value={'QUERY'} className="bg-gray-900">QUERY</option>
                    <option value={'REVIEW'} className="bg-gray-900">REVIEW</option>
                    <option value={'SCREENSHOT'} className="bg-gray-900">SCREENSHOT</option>
                    <option value={'NEWS'} className="bg-gray-900">NEWS</option>
                    <option value={'GUIDE'} className="bg-gray-900">GUIDE</option>
                    <option value={'HELP'} className="bg-gray-900">HELP</option>
                </select>
                <select
                    onChange={(e) => setFilter(e.target.value)}
                    className="cursor-pointer border-none bg-transparent outline-none"
                    value={filter}
                >
                    <option value={'latest'} className="bg-gray-900">Latest</option>
                    <option value={'popular'} className="bg-gray-900">Popular</option>
                </select>
            </div>
            <Posts />


            <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
                {loading && <ClipLoader color='white' size={40} />}
                {!hasMore && <p className="text-gray-500">No more posts</p>}
            </div>
        </div>
    )
}

export default InfiniteHomePostsFeed