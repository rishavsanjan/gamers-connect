'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

export default function AuthorCard({ author, authorId, gameCount, postCount, collectionCount, following }: { author: string | null; authorId: string; gameCount: number; postCount: number; collectionCount: number, following: boolean }) {
    const { data: session, status } = useSession()
    const [isFollowing, setIsFollowing] = useState(following);
    const [loading, setLoading] = useState(false);
    

    const addFollow = async () => {
        setLoading(true)
        const response = await axios({
            url: `/api/private/addfollow`,
            method: 'post',
            data: {
                followerId: session?.user.id,
                followingId: authorId
            }
        })

        setIsFollowing(prev => !prev)

        setLoading(false)
    }

    return (
        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
            <div className="mb-4 flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl">
                    {/* {avatar} */}
                </div>
                <div className="flex-1">
                    <p className="text-lg font-bold">{author}</p>
                    <p className="text-sm text-gray-400">Level 47 Gamer</p>
                </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-4 border-y border-white/10 py-4">
                <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">{postCount}</p>
                    <p className="text-xs text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">{gameCount}</p>
                    <p className="text-xs text-gray-400">Games</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">{collectionCount}</p>
                    <p className="text-xs text-gray-400">Collections</p>
                </div>
            </div>
            <button
                onClick={() => addFollow()}
                disabled={loading}
                className={`w-full rounded-lg py-3 font-semibold transition ${isFollowing
                    ? 'border border-purple-500 bg-transparent hover:bg-purple-500/10'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }`}
            >
                {
                    loading ?
                        <ClipLoader color='white' size={20} />
                        :
                        <>
                            {isFollowing ? 'Following' : 'Follow'}
                        </>

                }


            </button>
        </div>
    );
}