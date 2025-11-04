'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { BsHeartFill } from 'react-icons/bs'
import axios from 'axios'

interface LikeButtonProps {
    postId: string
    hasLiked: boolean
    likeCount: number
}

export default function LikeButton({ postId, hasLiked, likeCount }: LikeButtonProps) {
    const [liked, setLiked] = useState(hasLiked)
    const [count, setCount] = useState(likeCount)
    const [isPending, startTransition] = useTransition()

    const handleToggle = async () => {
        setLiked(prev => !prev)
        setCount(prev => (liked ? prev - 1 : prev + 1))

        try {
            await axios.post('/api/private/addorremovereaction', { postId })
        } catch (err) {
            console.error(err)
            setLiked(prev => !prev)
            setCount(prev => (liked ? prev + 1 : prev - 1))
        }
    }

    return (
        <button
            onClick={() => startTransition(handleToggle)}
            disabled={isPending}
            className="flex items-center space-x-2 text-gray-400 transition hover:text-pink-500"
        >
            {liked ? (
                <BsHeartFill className="h-5 w-5" color="#B4157D" />
            ) : (
                <Heart className="h-5 w-5" />
            )}
            <span>{count}</span>
        </button>
    )
}
