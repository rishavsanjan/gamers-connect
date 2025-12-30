'use client'

import { handleGroupJoin, handleGroupLeave } from '@/app/utils/community_functions';
import { useGroupDetails } from '@/context/GroupsContext';
import { useLoginModal } from '@/context/LoginModalContext';
import { useUser } from '@/context/UserContext';
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';


interface Props {
    hasJoined: boolean,
    groupId: string
}

type Role = 'owner' | 'admin' | 'member'

interface Member {
    id: string
    name: string | null
    username: string
    avatar: string | null
    role: Role
}

const JoinLeaveButton: React.FC<Props> = ({ hasJoined, groupId }) => {
    const [hasJoinedState, setHasJoinedState] = useState<boolean>(hasJoined);
    const [loading, setLoading] = useState(false);
    const { user, isLoggedIn } = useUser();
    const { setMemberCount, setMembersState, groupState } = useGroupDetails();
    const { openLoginModal } = useLoginModal();


    const handleJoin = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        setLoading(true)
        try {
            await handleGroupJoin({ groupId });
            setHasJoinedState(prev => !prev);
            const userJoined: Member = {
                id: user!.id,
                name: user?.name || null,
                username: user!.username,
                avatar: null,
                role: 'member'
            }

            setMembersState(prev => [...prev, userJoined])

            setMemberCount(prev => prev + 1);
            toast.success('Group joined successfully!');
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleLeave = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        setLoading(true)
        try {
            await handleGroupLeave({ groupId })
            setHasJoinedState(prev => !prev)
            setMembersState(prev =>
                prev.filter(member => member.id !== user!.id)
            )
            setMemberCount(prev => prev - 1);
            if (groupState.privacy === 'PRIVATE') {
                window.location.reload();
            }

            
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
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
                                groupState.ownerId === user?.id ?
                                    <>
                                        <Trash2 size={18}/>
                                        Delete
                                    </>
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





                        </>

                }

            </button>

        </>

    )
}

export default JoinLeaveButton