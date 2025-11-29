'use client'

import { handleGroupJoin, handleGroupLeave } from '@/app/utils/community_functions';
import { Check, ChevronDown, Plus } from 'lucide-react';
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners';

interface Props {
    hasJoined: boolean,
    groupId: string
}

const JoinLeaveButton: React.FC<Props> = ({ hasJoined, groupId }) => {
    const [hasJoinedState, setHasJoinedState] = useState<boolean>(hasJoined);
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        setLoading(true)
        try {
            await handleGroupJoin({ groupId })
            setHasJoinedState(prev => !prev)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }


    }
    const handleLeave = async () => {
        setLoading(true)
        try {
            await handleGroupLeave({ groupId })
            setHasJoinedState(prev => !prev)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            disabled={loading}
            onClick={hasJoinedState ? handleLeave : handleJoin}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3a3b3c] text-[#e4e6eb] rounded-md font-semibold hover:bg-[#4e4f50] transition-colors disabled:cursor-not-allowed">
            {

                loading ?
                    <ClipLoader size={25} color='white' />
                    :

                    <>
                        {
                            hasJoinedState ?
                                <>
                                    <Check size={16} />
                                    Joined
                                    <ChevronDown size={16} />
                                </>
                                :
                                <>
                                    <Plus />
                                    Join
                                </>
                        }


                    </>

            }

        </button>
    )
}

export default JoinLeaveButton