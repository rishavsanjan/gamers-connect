'use client';
import { useEffect, useState } from 'react';
import { Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import axios from 'axios';
import { BsBookmarkFill } from 'react-icons/bs';
import { useUser } from '@/context/UserContext';
import { useLoginModal } from '@/context/LoginModalContext';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rollbackPostFeeds, snapshotAllPostFeeds, updatePostInAllFeeds } from '@/app/queries/postCacheHelpers';
import { Post } from '@/app/types/post';

export default function PostActions({ postId, bookmark }: { postId: string; bookmark: boolean }) {
    const [bookmarked, setBookmarked] = useState(bookmark);
    const { isLoggedIn } = useUser();
    const { openLoginModal } = useLoginModal();

    const queryClient = useQueryClient();

    const VIEW_COOLDOWN = 5 * 60 * 1000;

    const updateViewMutation = useMutation({
        mutationFn: async () => {
            await axios.post(`/api/posts/count-view`, { postId })
        },
        onMutate: async () => {
            await queryClient.cancelQueries();
            const snapshots = snapshotAllPostFeeds(queryClient);
            updatePostInAllFeeds(queryClient, postId, (post: Post) => ({
                ...post,
                viewCount: post.viewCount + 1,
            }));

            return { snapshots }

        },
        onError: (_err, _vars, context) => {
            rollbackPostFeeds(queryClient, context?.snapshots);
        },
    })

    useEffect(() => {
        const key = `post_view_${postId}`;
        const lastViewed = localStorage.getItem(key);
        const now = Date.now();

        if (lastViewed && now - Number(lastViewed) < VIEW_COOLDOWN) {
            return;
        }

        const timer = setTimeout(async () => {
            updateViewMutation.mutate();
            // await axios.post(`/api/posts/count-view`, { postId })
            localStorage.setItem(key, now.toString());
        }, 3000);

        return () => clearTimeout(timer);
    }, [postId]);

    console.log(bookmark)

    // const handleBookmark = async () => {
    //     if (!isLoggedIn) {
    //         openLoginModal();
    //         return;
    //     }
    //     const response = await axios({
    //         url: `/api/private/handlebookmarks`,
    //         method: 'post',
    //         data: {
    //             postId
    //         }
    //     })
    //     setBookmarked(prev => !prev)
    // }

    const bookmarkMutation = useMutation({
        mutationFn: async () => axios.post(`/api/private/handlebookmarks`, { postId }),

        onMutate: async () => {
            await queryClient.cancelQueries();
            const snapshots = snapshotAllPostFeeds(queryClient);

            // 🔥 Update in ALL feeds
            updatePostInAllFeeds(queryClient, postId, (post: any) => ({
                ...post,
                hasBookmarked: !post.hasBookmarked,
            }));

            // 🔥 Update single post detail
            queryClient.setQueryData(['post', postId], (old: any) =>
                old ? { ...old, hasBookmarked: !old.hasBookmarked } : old
            );

            return { snapshots };
        },

        onError: (_err, _vars, context) => {
            rollbackPostFeeds(queryClient, context?.snapshots);
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        },
    });


    return (
        <div className="flex items-center space-x-4">

            <button
                onClick={() => { bookmarkMutation.mutate() }}
                className={`rounded-lg p-2 transition cursor-pointer hover:bg-white/10`}
            >
                {
                    bookmark ?
                        <BsBookmarkFill className='h-5 w-5' />
                        :
                        <Bookmark className={` h-5 w-5`} />

                }
            </button>
            <button
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                }}
                className="rounded-lg p-2 transition hover:bg-white/10 cursor-pointer">
                <Share2 className="h-5 w-5" />
            </button>

        </div>
    );
}