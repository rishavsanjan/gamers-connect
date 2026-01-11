// src/app/community/post_details/[postId]/PostCacheSeeder.tsx
'use client';

import { Post } from '@/app/types/post';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';



export default function PostCacheSeeder({ post }: { post: Post }) {
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.setQueryData(['post', post.id], post);
    }, [post.id, queryClient]); // Only re-run if post.id changes

    return null; // This component doesn't render anything
}