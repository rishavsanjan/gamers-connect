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
            <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg ">
                <button
                    onClick={() => setShowPostModal(true)}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold transition hover:from-purple-700 hover:to-pink-700"
                >
                    <Send className="h-5 w-5" />
                    <span>Create Post</span>
                </button>

            </div>
            {showPostModal && (
                <CreatePostModal groupId={groupId} setShowPostModal={setShowPostModal} />
            )}
        </>

    )
}

export default AddPostModal