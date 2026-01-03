'use client'
import CreatePostModal from '@/components/community/CreatePost';
import { useUser } from '@/context/UserContext';
import React, { useState } from 'react'
interface Props {
    groupId?: string
}

const PostCreate: React.FC<Props> = ({ groupId }) => {
    const { user } = useUser();
    const [showPostModal, setShowPostModal] = useState(false);

    return (
        <>
            <div className=" bg-[#1a1a2e] flex items-center justify-center p-4 rounded-xl">
                <div className="w-full ">
                    {/* User greeting section */}
                    <div className="flex items-center gap-3 ">

                        <h2 className="text-gray-400 text-lg">
                            Hey <span className="text-white">@{user?.username || 'anonymous'}</span>
                        </h2>
                    </div>

                    {/* Search input */}
                    <div onClick={() => { setShowPostModal(true) }} className="relative">
                        <input
                            type="text"
                            placeholder="So, what's on your mind?"
                            className="w-full bg-[#2a2a3e] text-gray-300 placeholder-gray-500 
                     px-6 py-4 rounded-lg border border-gray-700 
                     focus:outline-none focus:border-blue-500 focus:ring-1 
                     focus:ring-blue-500 transition-all text-base"
                        />
                    </div>
                </div>
            </div>
            {showPostModal && (
                <CreatePostModal groupId={groupId} setShowPostModal={setShowPostModal} />
            )}
        </>

    )
}

export default PostCreate