'use client';
import { useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { BsBookmarkFill } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { useLoginModal } from '@/context/LoginModalContext';
import { ClipLoader } from 'react-spinners';
import { usePostFeedStore } from '@/zustland/postFeedStore';
import { Post } from '@/app/types/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removePostFromAllFeeds, rollbackPostFeeds, snapshotAllPostFeeds, updatePostInAllFeeds } from '@/app/queries/postCacheHelpers';

interface PostActionsProps {
  postId: string;
  hasBookmarked: boolean;
  postOwnerId: string
  actions: {
    updatePost: (id: string, data: Partial<Post>) => void
    toggleBookmark: (id: string) => void
    deletePost: (id: string) => void
  }
}

export default function PostActions({ postId, hasBookmarked, postOwnerId, actions }: PostActionsProps) {


  const { isLoggedIn, user } = useUser();
  const { openLoginModal } = useLoginModal();

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/private/deletepost', {
        postId
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries();

      const snapshots = snapshotAllPostFeeds(queryClient);

      removePostFromAllFeeds(queryClient, postId);

      return { snapshots };
    },

    onError: (_err, _vars, context) => {
      rollbackPostFeeds(queryClient, context?.snapshots);
    },
  })

  const handleBookmarkMutation = useMutation({
    mutationFn: async () => {
      axios.post('/api/private/handlebookmarks', {
        postId
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries();

      const snapshots = snapshotAllPostFeeds(queryClient);

      updatePostInAllFeeds(queryClient, postId, (post: Post) => ({
        ...post,
        hasBookmarked: !post.hasBookmarked,
      }));


      return { snapshots };
    },

    onError: (_err, _vars, context) => {
      rollbackPostFeeds(queryClient, context?.snapshots);
    },
  })

  const isBookmarking = handleBookmarkMutation.isPending



  return (
    <div className="flex flex-col items-center space-x-4">
      <button
        onClick={() => {
          if (!isLoggedIn) {
            openLoginModal();
            return;
          }
          handleBookmarkMutation.mutate()
        }}
        disabled={isBookmarking}
        className={`rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed  cursor-pointer ${hasBookmarked ? 'text-purple-400' : 'text-gray-400'
          }`}
      >
        {hasBookmarked ? (
          <div className='flex flex-row gap-1 items-center'>
            <BsBookmarkFill className='h-5 w-5' />

            <span>Saved</span>
          </div>

        ) : (
          <div className='flex flex-row gap-1 items-center'>
            <Bookmark className='h-5 w-5' />

            <span>Save post</span>
          </div>

        )}
      </button>
      {
        postOwnerId === user?.id &&
        <button
          onClick={() => { deletePostMutation.mutate() }}
          disabled={deletePostMutation.isPending}
          className={`rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed }`}
        >
          {
            deletePostMutation.isPending ?
              <ClipLoader color='red' size={23} />
              :
              <div className='flex flex-row gap-1 items-center'>
                <Trash2 className='h-5 w-5 text-red-500' />
                <span className='text-red-500'>Delete Post</span>
              </div>
          }

        </button>
      }
    </div>
  );
}