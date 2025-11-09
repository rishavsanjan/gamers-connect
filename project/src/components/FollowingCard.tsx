import { Follower } from '@/app/types/follower'
import { addFollow } from '@/app/utils/community_functions'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'

interface Props {
    user: Follower
}

const FollowingCard: React.FC<Props> = ({ user }) => {
    const { data: session } = useSession();
    const displayName = user.name ?? user.username ?? 'Anonymous'
    const firstLetter = displayName.charAt(0).toUpperCase()
    const [following, setFollowing] = useState(!!user.isFollowingBack);
    const [loading, setLoading] = useState(false);

    const handleFollow = async (userId: string) => {
        setLoading(true);
        addFollow({ otherPersonId: userId, myId:session?.user.id });
        setFollowing(prev => !prev)
        setLoading(false);
    }

    return (
        <div className='flex items-center justify-between space-x-4 bg-white self-start dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center space-x-3'>
                {/* Profile Picture or Avatar */}
                {/* @ts-ignore */}
                {user.profilePicture ? (
                    <img
                        //@ts-ignore
                        src={user.profilePicture}
                        alt={displayName}
                        className='w-12 h-12 rounded-full object-cover'
                    />
                ) : (
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                        <span className='text-white font-semibold text-lg'>
                            {firstLetter}
                        </span>
                    </div>
                )}

                {/* User Info */}
                <div className='flex flex-col'>
                    <p className='text-gray-900 dark:text-white font-medium'>
                        {displayName}
                    </p>
                    {user.username && user.name && (
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>
                            @{user.username}
                        </p>
                    )}
                </div>
            </div>

            {/* Follow Button */}
            <button
                onClick={() => handleFollow(user.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${following
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow items-center justify-center'
                    }`}
            >
                {
                    loading ?
                        <>
                            <ClipLoader color='white' size={20} />
                        </>
                        :
                        <>
                            {following ? 'Following' : 'Follow'}
                        </>

                }

            </button>
        </div>
    )
}

export default FollowingCard