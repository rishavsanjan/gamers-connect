'use client'
import { handleLike, handleRemoveLike } from '@/app/utils/community_functions'
import { useUser } from '@/context/UserContext'
import { Heart } from 'lucide-react'
import React, { useState } from 'react'
import { BsHeartFill } from 'react-icons/bs'
import { LoginModal } from '../NotLogged'
import { createPortal } from 'react-dom'


interface Props {
    postId: string,
    hasLiked: boolean,
    likeCount: number
}

const PostLikeButton: React.FC<Props> = ({ postId, hasLiked, likeCount }) => {
    const [loginModal, setLoginModal] = useState(false);
    const { user, isLoggedIn } = useUser();
    console.log(isLoggedIn, user)

    const [liked, setLiked] = useState(hasLiked);
    const [count, setCount] = useState(likeCount);

    const handleRemoveReaction = async () => {
        if (!isLoggedIn) {
            setLoginModal(true);
            return;
        }

        await handleRemoveLike(postId)
        setLiked(false);
        setCount(prev => prev - 1)
    }

    const handleAddReaction = async () => {
        if (!isLoggedIn) {
            setLoginModal(true);
            return;
        }

        await handleRemoveLike(postId)
        setLiked(true);
        setCount(prev => prev + 1)
    }

    return (
        <div>
            {
                liked ?
                    <button
                        onClick={() => {
                            handleRemoveReaction()

                        }}
                        className="flex items-center space-x-2 text-gray-400 transition hover:text-pink-500"
                    >
                        <BsHeartFill className="h-5 w-5" color='#B4157D' />
                        <span>{count}</span>
                    </button>

                    :
                    <button
                        onClick={() => { handleAddReaction() }}
                        className="flex items-center space-x-2 text-gray-400 transition hover:text-pink-500"
                    >
                        <Heart className="h-5 w-5" />
                        <span>{count}</span>
                    </button>
            }
            {loginModal && typeof window !== 'undefined' && createPortal(
                <LoginModal isOpen={loginModal} setLoginModal={setLoginModal} />,
                document.body
            )}

        </div>
    )
}

export default PostLikeButton