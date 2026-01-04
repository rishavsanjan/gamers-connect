'use client'
import { Share2 } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';
import { FaLink } from 'react-icons/fa';

const CopyButton = () => {
    return (
        <button

            onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }}
            className="flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-700 cursor-pointer">
            <FaLink className="h-5 w-5" />
            <span>Share</span>
        </button>

    )
}

export default CopyButton