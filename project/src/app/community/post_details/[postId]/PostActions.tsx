'use client';
import { useState } from 'react';
import { Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import axios from 'axios';
import { BsBookmarkFill } from 'react-icons/bs';
import { useUser } from '@/context/UserContext';
import { useLoginModal } from '@/context/LoginModalContext';

export default function PostActions({ postId, bookmark }: { postId: string; bookmark: boolean }) {
    const [bookmarked, setBookmarked] = useState(bookmark);
    const { isLoggedIn } = useUser();
    const { openLoginModal } = useLoginModal();


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
        console.log(response.data)
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
            <button className="rounded-lg p-2 transition hover:bg-white/10">
                <Share2 className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 transition hover:bg-white/10">
                <MoreHorizontal className="h-5 w-5" />
            </button>
        </div>
    );
}