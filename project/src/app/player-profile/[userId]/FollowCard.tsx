'use client'
import { addFollow } from '@/app/utils/community_functions';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners';

interface Props {
    isFollowing: boolean
    userId: string
}

const FollowCard: React.FC<Props> = ({ isFollowing, userId }) => {
    const { data: session } = useSession();

    const [following, setFollowing] = useState(isFollowing);
    const [loading, setLoading] = useState(false);

    const handleFollow = async () => {

        setLoading(true);
        addFollow({ otherPersonId: userId, myId: session?.user.id });
        setFollowing(prev => !prev)
        setLoading(false);
    }

    return (
        <button
            onClick={() => { handleFollow() }}
            className='bg-white p-2 px-6 rounded-sm text-black hover:bg-gray-200 ease-in-out transition-all duration-200 cursor-pointer'>

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