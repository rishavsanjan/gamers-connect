'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { BsHeartFill } from 'react-icons/bs'
import axios from 'axios'
import { useUser } from '@/context/UserContext'
import { useLoginModal } from '@/context/LoginModalContext'

interface LikeButtonProps {
    postId: string
    hasLiked: boolean
    likeCount: number
}

export default function LikeButton({ postId, hasLiked, likeCount }: LikeButtonProps) {

    const { isLoggedIn } = useUser();
    const { openLoginModal } = useLoginModal();


    const [loginModal, setLoginModal] = useState()
    const [liked, setLiked] = useState(hasLiked)
    const [count, setCount] = useState(likeCount)
    const [isLoading, setIsLoading] = useState(false)

    const handleToggle = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }


        const previousLiked = liked
        const previousCount = count

        setLiked(!liked)
        setCount(liked ? count - 1 : count + 1)
        setIsLoading(true)


        try {
            await axios.post('/api/private/addorremovereaction', { postId })
        } catch (err) {
            console.error('err')
            setLiked(previousLiked)
            setCount(previousCount)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
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