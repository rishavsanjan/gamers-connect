import { Post } from '@prisma/client'
import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners';

interface Props {
    posts: Post[],
    groupId: string
}

const InfiniteGroupMedia: React.FC<Props> = ({ posts, groupId }) => {

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [postsState, setPostsState] = useState(posts);


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
                url: `/api/get-group-media?page=${page}`,
                method: 'post',
                data: { groupId }
            });

            const newPosts = response.data.posts;
            console.log(newPosts)
            if (page === 1) {
                setPostsState(newPosts);
            } else {
                setPostsState(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNewPosts = newPosts.filter((post: Post) => !existingIds.has(post.id));
                    return [...prev, ...uniqueNewPosts];
                });
            }

            if (newPosts.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (page === 1) return;

        getPosts();
    }, [page]);

    return (
        <div ref={lastPostRef} className='flex flex-col items-center gap-4'>
            <div className='grid-cols-2 grid gap-4'>
                {postsState.map((post) =>
                    post.mediaUrls.map((media) => (
                        <Link href={`/community/post_details/${post.id}`} key={post.id}>
                            <img

                                key={media}
                                src={media}
                                alt=""
                                className="rounded-lg hover:opacity-50 ease-in-out duration-300 "
                            />
                        </Link>



                    ))
                )}
            </div>
            {loading && <ClipLoader color='white' size={40} />}
            {!hasMore && <span className='text-gray-500'>No more media!</span>}


        </div>

    )
}

export default InfiniteGroupMedia