'use client';
import { useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { BsBookmarkFill } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { useLoginModal } from '@/context/LoginModalContext';
import { usePostFeed } from '@/context/PostsContext';
import { ClipLoader } from 'react-spinners';

interface PostActionsProps {
  postId: string;
  hasBookmarked: boolean;
  postOwnerId: string
}

export default function PostActions({ postId, hasBookmarked, postOwnerId }: PostActionsProps) {
  const [bookmarked, setBookmarked] = useState(hasBookmarked);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const { isLoggedIn, user } = useUser();
  const { openLoginModal } = useLoginModal();
  const { toggleBookamrk, deletePost } = usePostFeed();
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
        deletePost(postId);

      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  }

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    if (isBookmarking) return;

    setIsBookmarking(true);
    const previousState = bookmarked;

    // Optimistic update
    setBookmarked(prev => !prev);

    try {
      const response = await axios.post('/api/private/handlebookmarks', {
        postId
      });

      if (response.data.success) {
        toast.success(bookmarked ? 'Bookmark removed' : 'Post bookmarked');
        toggleBookamrk(postId);

      }

    } catch (error) {
      // Revert on error
      setBookmarked(previousState);
      console.error('Bookmark error:', error);
      toast.error('Failed to update hasBookmarked');
    } finally {
      setIsBookmarking(false);
    }
  };


  return (
    <div className="flex flex-col items-center space-x-4">
      <button
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={`rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${bookmarked ? 'text-purple-400' : 'text-gray-400'
          }`}
      >
        {bookmarked ? (
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