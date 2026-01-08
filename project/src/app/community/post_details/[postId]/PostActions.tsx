'use client';
import { useEffect, useState } from 'react';
import { Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import axios from 'axios';
import { BsBookmarkFill } from 'react-icons/bs';
import { useUser } from '@/context/UserContext';
import { useLoginModal } from '@/context/LoginModalContext';
import toast from 'react-hot-toast';

export default function PostActions({ postId, bookmark }: { postId: string; bookmark: boolean }) {
    const [bookmarked, setBookmarked] = useState(bookmark);
    const { isLoggedIn } = useUser();
    const { openLoginModal } = useLoginModal();

    const VIEW_COOLDOWN = 5 * 60 * 1000;

    useEffect(() => {
        const key = `post_view_${postId}`;
        const lastViewed = localStorage.getItem(key);
        console.log('i m hit')
        const now = Date.now();

        if (lastViewed && now - Number(lastViewed) < VIEW_COOLDOWN) {
            console.log('i m hit twice')
            return;
        }
        

        const timer = setTimeout( async() => {
            await axios.post(`/api/posts/count-view`, { postId })
            localStorage.setItem(key, now.toString());
        }, 3000);

        return () => clearTimeout(timer);
    }, [postId]);



    const handleBookmark = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        const response = await axios({
            url: `/api/private/handlebookmarks`,
            method: 'post',
            data: {
                postId
            }
        })
        setBookmarked(prev => !prev)
    }

    return (
        <div className="flex items-center space-x-4">

            <button
                onClick={() => { handleBookmark() }}
                className={`rounded-lg p-2 transition cursor-pointer hover:bg-white/10`}
            >
                {
                    bookmarked ?
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