// src/app/community/post_details/[postId]/PostActionsCLient.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import PostActions from './PostActions';
import { Post } from '@/app/types/post';

export default function PostActionClient({ postId }: { postId: string }) {
    const { data } = useQuery<Post>({
        queryKey: ['post', postId],
        staleTime: Infinity,
    });

    if (!data) return null;

    return (
        <PostActions
            postId={data.id}
            bookmark={data.hasBookmarked}
        />
    );
}