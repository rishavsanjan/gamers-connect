import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import { fetchGroupMedia } from '@/app/queries/posts';
import { Post } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClipLoader } from 'react-spinners';

interface Media {
    id: string,
    mediaUrls: string[]
}

interface Props {
    posts: Array<{
        id: string,
        mediaUrls: string[]
    }>,
    groupId: string
}

const InfiniteGroupMedia: React.FC<Props> = ({ posts, groupId }) => {

    const [postsState, setPostsState] = useState(posts);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['group-media', groupId],
        queryFn: fetchGroupMedia,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 30
    });

    useEffect(() => {
        if (!data) return

        const allMedia: Media[] = data.pages.flatMap(p => p.media)
        setPostsState(allMedia)
    }, [data, setPostsState])

    const lastPostRef = useInfiniteScroll(isFetchingNextPage, hasNextPage ?? false, fetchNextPage);


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
            {isFetchingNextPage && <ClipLoader color='white' size={40} />}
            {!hasNextPage && <span className='text-gray-500'>No more media!</span>}


        </div>

    )
}

export default InfiniteGroupMedia