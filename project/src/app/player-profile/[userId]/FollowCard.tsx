'use client'
import { addFollow } from '@/app/utils/community_functions';
import { useLoginModal } from '@/context/LoginModalContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners';

interface Props {
    isFollowing: boolean
    userId: string
    userPrivacy: string
}

const FollowCard: React.FC<Props> = ({ isFollowing, userId, userPrivacy }) => {
    const { isLoggedIn, user } = useUser();
    const { openLoginModal } = useLoginModal()
    const [following, setFollowing] = useState(isFollowing);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleFollow = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }

        setLoading(true);
        addFollow({ otherPersonId: userId, myId: user?.id });
        if (userPrivacy === 'PRIVATE' && isFollowing === true) {
            router.refresh();
        }
        setFollowing(prev => !prev)
        setLoading(false);
    }

    return (
        <button
            disabled={loading}
            onClick={() => { handleFollow() }}
            className={`${following ? ' border-white border-2 bg-transparent text-white' : 'bg-white text-black'}  p-2 px-6 rounded-sm  ease-in-out transition-all duration-200 cursor-pointer disabled:cursor-not-allowed`}>

            {
                loading ?
                    <>
                        <ClipLoader color='black' size={20} />
                    </>
                    :
                    <>
                        {following ? 'Following' : 'Follow'}
                    </>

            }
        </button>
    )
}

export default FollowCard