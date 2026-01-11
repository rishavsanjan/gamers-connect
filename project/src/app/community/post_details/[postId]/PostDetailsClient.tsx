'use client';

import { useQuery } from '@tanstack/react-query';
import PostLikeButton from '@/components/community/PostLikeButton';
import { Post } from '@/app/types/post';



export default function PostDetailsClient({ postId }: { postId: string }) {
    const { data } = useQuery<Post>({
        queryKey: ['post', postId],
        staleTime: Infinity,
    });

    if (!data) return null;

    return (
        <PostLikeButton
            postId={data.id}
            hasLiked={data.hasLiked}
            likeCount={data.likeCount}
        />
    );
}