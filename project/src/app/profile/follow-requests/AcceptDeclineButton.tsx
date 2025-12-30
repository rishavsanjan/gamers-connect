'use client'
import { acceptFollowRequest, acceptGroupInvite, declineFollowRequest, declineGroupInvite } from '@/app/queries/requests'
import { useLoginModal } from '@/context/LoginModalContext'
import { useUser } from '@/context/UserContext'
import { useMutation } from '@tanstack/react-query'
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
    const { isLoggedIn } = useUser();
    const { openLoginModal } = useLoginModal();
    const receiverId = user?.id;

    const acceptMutation = useMutation({
        mutationFn: async () => {
            if (tab === 'request' && senderId && receiverId) {
                await acceptFollowRequest({ senderId, receiverId })
            } else if (tab === 'invite' && groupId) {
                await acceptGroupInvite({ groupId })
            }
        },
        onSuccess: () => {
            if (tab === 'request' && senderId && setRequests) {
                setRequests(prev => prev.filter(r => r.id !== senderId));
            }
            if (tab === 'invite' && setInvites && groupId) {
                setInvites(prev => prev.filter(i => i.id !== groupId));
            }
        }
    });

    const declineMutation = useMutation({
        mutationFn: async () => {
            if (tab === 'request') {
                if (!senderId || !receiverId) return;
                await declineFollowRequest({ senderId, receiverId });
            } else {
                if (!groupId) return;
                await declineGroupInvite({ groupId });
            }
        },
        onSuccess: () => {
            if (tab === 'request' && setRequests && senderId) {
                setRequests(prev => prev.filter(r => r.id !== senderId));
            }

            if (tab === 'invite' && setInvites && groupId) {
                setInvites(prev => prev.filter(i => i.id !== groupId));
            }
        },
    });

    const handleAccept = () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        acceptMutation.mutate();
    };

    const handleDecline = () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        declineMutation.mutate();
    };

    const accepting = acceptMutation.isPending;
    const declining = declineMutation.isPending;


    return (
        <div className="flex items-center gap-3 sm:self-center shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            <button
                onClick={handleDecline}
                disabled={declining}
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
                onClick={handleAccept}
                disabled={accepting}
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