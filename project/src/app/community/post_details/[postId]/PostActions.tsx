'use client';
import { useState } from 'react';
import { Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import axios from 'axios';

export default function PostActions({ postId, bookmark }: { postId: string; bookmark: boolean }) {
    const [bookmarked, setBookmarked] = useState(false);



    const handleBookmark = async () => {
        const response = await axios({
            url: `/api/private/add-bookmark`,
            method: 'post',
            data: {
                postId
            }
        })
    }

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`rounded-lg p-2 transition ${bookmarked ? 'bg-purple-600' : 'hover:bg-white/10'}`}
            >
                <Bookmark className="h-5 w-5" />
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