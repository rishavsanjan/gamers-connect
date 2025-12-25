'use client'



import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { Post } from '@/app/types/post'
import Posts from '@/components/community/Posts'
import { PostFeedProvider, usePostFeed } from '@/context/PostsContext'
import axios from 'axios'
import { Filter } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface Props {
}

const InfiniteHomePostsFeed: React.FC<Props> = () => {
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [filter, setFilter] = useState('');
    const [category, setCategory] = useState('');
    const { setPosts } = usePostFeed();

    const lastPostRef = useInfiniteScroll(loading, hasMore, setPage);

    const getPosts = async () => {
        setLoading(true);
        try {
            const response = await axios({
                url: `/api/getposts?page=${page}`,
                method: 'post',
                data: { filter, category }
            });

            const newPosts = response.data.posts;
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

                const newPosts = response.data.posts;
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
            <div className="flex items-center gap-4 rounded-2xl border border-purple-500/20 bg-white/5 p-4 backdrop-blur-lg mb-4">
                <Filter className="h-5 w-5 text-purple-400" />

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="flex-1 bg-transparent">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        {["ALL", "QUERY", "REVIEW", "SCREENSHOT", "NEWS", "GUIDE", "HELP"].map(item => (
                            <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[120px] bg-transparent">
                        <SelectValue placeholder="Latest" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="popular">Popular</SelectItem>
                    </SelectContent>
                </Select>
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