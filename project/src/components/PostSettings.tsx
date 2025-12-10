'use client';
import { useState } from 'react';
import { Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { BsBookmarkFill } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { useLoginModal } from '@/context/LoginModalContext';
import { Post } from '@/app/types/post';
import { usePostFeed } from '@/context/PostsContext';

interface PostActionsProps {
  postId: string;
  hasBookmarked: boolean;
}

export default function PostActions({
  postId,
  hasBookmarked
}: PostActionsProps) {
  const [bookmarked, setBookmarked] = useState(hasBookmarked);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const { isLoggedIn } = useUser();
  const { openLoginModal } = useLoginModal();
  const { toggleBookamrk } = usePostFeed();
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
    <div className="flex items-center space-x-4">
      <button
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={`rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${bookmarked ? 'text-purple-400' : 'text-gray-400'
          }`}
      >
        {bookmarked ? (
          <div className='flex flex-row gap-1 items-center'>
            <span>Saved</span>
            <BsBookmarkFill className='h-5 w-5' />
          </div>

        ) : (
          <div className='flex flex-row gap-1 items-center'>
            <span>Save post</span>
            <Bookmark className='h-5 w-5' />
          </div>

        )}
      </button>




    </div>
  );
}