'use client';
import { useState } from 'react';

export default function AuthorCard({ author,gameCount, postCount,collectionCount }: { author: string | null;  gameCount:number; postCount:number; collectionCount:number }) {
    const [following, setFollowing] = useState(false);

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
                onClick={() => setFollowing(!following)}
                className={`w-full rounded-lg py-3 font-semibold transition ${following
                        ? 'border border-purple-500 bg-transparent hover:bg-purple-500/10'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }`}
            >
                {following ? 'Following' : 'Follow'}
            </button>
        </div>
    );
}