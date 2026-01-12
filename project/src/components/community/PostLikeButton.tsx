'use client';

import { handleLike, handleRemoveLike } from '@/app/utils/community_functions';
import { useUser } from '@/context/UserContext';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import { BsHeartFill } from 'react-icons/bs';
import { LoginModal } from '../NotLogged';
import { createPortal } from 'react-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    updatePostInAllFeeds,
    snapshotAllPostFeeds,
    rollbackPostFeeds,
} from '../../app/queries/postCacheHelpers';
import { Post } from '@prisma/client';

interface Props {
    postId: string;
    hasLiked: boolean;
    likeCount: number;
}

type MutationContext = {
    snapshots?: [readonly unknown[], unknown][];
};

const PostLikeButton: React.FC<Props> = ({ postId, hasLiked, likeCount }) => {
    const { isLoggedIn } = useUser();
    const [loginModal, setLoginModal] = useState(false);
    const queryClient = useQueryClient();

    const likeMutation = useMutation({
        mutationFn: () => handleLike(postId),

        onMutate: async () => {
            await queryClient.cancelQueries();

            const snapshots = snapshotAllPostFeeds(queryClient);

            updatePostInAllFeeds(queryClient, postId, (post: Post) => ({
                ...post,
                hasLiked: true,
                likeCount: post.likeCount + 1,
            }));

            queryClient.setQueryData(['post', postId], (old: any) =>
                old
                    ? {
                        ...old,
                        hasLiked: true,
                        likeCount: old.likeCount + 1,
                    }
                    : old
            );

            return { snapshots };
        },

        onError: (_err, _vars, context) => {
            rollbackPostFeeds(queryClient, context?.snapshots);
        },
    });

    const unlikeMutation = useMutation({
        mutationFn: () => handleRemoveLike(postId),

        onMutate: async () => {
            await queryClient.cancelQueries();

            const snapshots = snapshotAllPostFeeds(queryClient);

            updatePostInAllFeeds(queryClient, postId, (post: Post) => ({
                ...post,
                hasLiked: false,
                likeCount: post.likeCount - 1,
            }));

            queryClient.setQueryData(['post', postId], (old: any) =>
                old
                    ? {
                        ...old,
                        hasLiked: false,
                        likeCount: old.likeCount - 1,
                    }
                    : old
            );

            return { snapshots };
        },

        onError: (_err, _vars, context) => {
            rollbackPostFeeds(queryClient, context?.snapshots);
        },
    });

    const isLoading = likeMutation.isPending || unlikeMutation.isPending;

    const handleClick = () => {
        if (!isLoggedIn) {
            setLoginModal(true);
            return;
        }

        if (hasLiked) {
            unlikeMutation.mutate();
        } else {
            likeMutation.mutate();
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className="flex items-center space-x-2 text-gray-400 transition hover:text-pink-500 disabled:cursor-not-allowed"
            >
                {hasLiked ? (
                    <BsHeartFill className="h-5 w-5" color="#B4157D" />
                ) : (
                    <Heart className="h-5 w-5" />
                )}
                <span>{likeCount}</span>
            </button>

            {loginModal &&
                typeof window !== 'undefined' &&
                createPortal(
                    <LoginModal isOpen={loginModal} setLoginModal={setLoginModal} />,
                    document.body
                )}
        </div>
    );
};

export default PostLikeButton;
