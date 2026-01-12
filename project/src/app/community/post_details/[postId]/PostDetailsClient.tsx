'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import PostLikeButton from '@/components/community/PostLikeButton';
import { Post } from '@/app/types/post';



export default function PostDetailsClient({ postId }: { postId: string }) {
    const queryClient = useQueryClient();

    const { data } = useQuery<Post>({
        queryKey: ['post', postId],
        queryFn: async () => {
            throw new Error('Post queryFn should never be called');
        },
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