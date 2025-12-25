'use client'
import { handleGroupJoin } from '@/app/utils/community_functions'
import { useLoginModal } from '@/context/LoginModalContext'
import { useUser } from '@/context/UserContext'
import axios from 'axios'
import { Check } from 'lucide-react'
import React, { SetStateAction, useState } from 'react'
import { GoX } from 'react-icons/go'
import { ClipLoader } from 'react-spinners'


interface Requests {
    id: string,
    name: string | null,
    username: string,
    avatar: string | null,
    xp: number,
    createdAt: Date
}

interface Invites {
    id: string,
    name: string,
    coverImage: string | null,
    createdAt: Date

}


interface Props {
    senderId?: string,
    setRequests?: React.Dispatch<SetStateAction<Requests[]>>
    setInvites?: React.Dispatch<SetStateAction<Invites[]>>
    tab: 'invite' | 'request'
    groupId?: string

}

const AcceptDeclineButton: React.FC<Props> = ({ senderId, setRequests, setInvites, tab, groupId }) => {

    const { user } = useUser();
    const [accepting, setAccepting] = useState(false);
    const [declining, setDeclining] = useState(false);
    const { isLoggedIn } = useUser();
    const { openLoginModal } = useLoginModal();
    const handleRequestAccept = async (id: string) => {
        if (!senderId) {
            return;
        }
        setAccepting(true);
        try {
            const response = await axios({
                url: `/api/private/follow-group-requests/follow-request-accept`,
                method: 'post',
                data: {
                    senderId,
                    receiverId: user?.id
                }
            })
            if (setRequests) {
                setRequests(prev => prev.filter(req => req.id !== id));
            }


        } catch (error) {
            console.log(error);
        } finally {
            setAccepting(false);
        }
    }

    const handleRequestDecline = async (id: string) => {
        setDeclining(true);
        try {
            const response = await axios({
                url: `/api/private/follow-group-requests/follow-request-ignore`,
                method: 'post',
                data: {
                    senderId,
                    receiverId: user?.id
                }
            })
            if (setRequests) {
                setRequests(prev => prev.filter(req => req.id !== id));
            }

        } catch (error) {
            console.log(error);
        } finally {
            setDeclining(false);
        }
    }

    const handleJoin = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        if (!groupId) {
            return;
        }
        setAccepting(true)
        try {
            const response = await axios({
                url: `/api/private/group/group-invite-accept`,
                method: 'post',
                data: {
                    groupId
                }
            })
            if (setInvites) {
                setInvites(prev => prev.filter(inv => inv.id !== groupId))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setAccepting(false)
        }
    }


    return (
        <div className="flex items-center gap-3 sm:self-center shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            <button
                onClick={() => { senderId && handleRequestDecline(senderId) }}
                className="flex-1 sm:flex-none h-10 px-4 rounded-lg border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 w-32">
                {
                    declining ?
                        <ClipLoader color='white' size={20} />
                        :
                        <>
                            <GoX size={18} />
                            Decline
                        </>

                }

            </button>
            <button
                onClick={() => { senderId ? handleRequestAccept(senderId) : handleJoin() }}
                className="flex-1 sm:flex-none h-10 px-6 rounded-lg bg-[#3713ec] hover:bg-[#3713ec]/90 text-white font-bold text-sm shadow-lg shadow-[#3713ec]/20 transition-all flex items-center justify-center gap-2 w-32">
                {
                    accepting ?
                        <ClipLoader color='white' size={20} />
                        :
                        <>
                            <Check size={18} />
                            Accept
                        </>
                }

            </button>
        </div>
    )
}

export default AcceptDeclineButton