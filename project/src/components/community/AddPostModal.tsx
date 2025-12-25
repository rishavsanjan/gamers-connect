'use client'

import { Send } from 'lucide-react'
import React, { useState } from 'react'
import CreatePostModal from './CreatePost';

interface Props {
    groupId?: string
}

const AddPostModal: React.FC<Props> = ({ groupId }) => {

    const [showPostModal, setShowPostModal] = useState(false);
    return (
        <>
            <div className="bg-white dark:bg-[#1E1538] rounded-xl p-5 shadow-lg border border-gray-200 dark:border-white/5">

                <button
                    onClick={() => setShowPostModal(true)}
                    className="w-full bg-gradient-to-r from-[#9F00B5] to-[#D9008F] hover:from-[#D9008F] hover:to-[#9F00B5] text-white font-semibold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(217,0,143,0.2)] transform transition hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 group">
                    <Send className="h-5 w-5 material-icons-round group-hover:rotate-50 transition-transform" />
                    Create Post
                </button>

            </div>
            {showPostModal && (
                <CreatePostModal groupId={groupId} setShowPostModal={setShowPostModal} />
            )}
        </>

    )
}

export default AddPostModal