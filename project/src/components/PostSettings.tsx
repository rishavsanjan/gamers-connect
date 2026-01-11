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
import { rollbackPostFeeds, snapshotAllPostFeeds, updatePostInAllFeeds } from '@/app/queries/postCacheHelpers';

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
  const [deleting, setDeleting] = useState(false);

  const handleDeletePost = async () => {
    setDeleting(true)
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    try {
      const response = await axios.post('/api/private/deletepost', {
        postId
      });

      if (response.data.success) {
        toast.success('Post deleted!');
        actions.deletePost(postId);

      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }

  const queryClient = useQueryClient();

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
        onClick={() => { handleBookmarkMutation.mutate() }}
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
          onClick={() => { handleDeletePost() }}
          disabled={deleting}
          className={`rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed }`}
        >
          {
            deleting ?
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