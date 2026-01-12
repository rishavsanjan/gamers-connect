'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import PostLikeButton from '@/components/community/PostLikeButton';
import { Post } from '@/app/types/post';
import PostCommentCount from './PostCommentCount';



export default function PostCommentClient({ postId }: { postId: string }) {
    const queryClient = useQueryClient();

    const { data } = useQuery<Post>({
        queryKey: ['post', postId],
        queryFn: async () => {
            throw new Error('Post queryFn should never be called');
        },
        staleTime: Infinity,
    });

    console.log(data)

    if (!data) return null;

    return (
        <PostCommentCount commentCount={data.commentCount} />
    );
}