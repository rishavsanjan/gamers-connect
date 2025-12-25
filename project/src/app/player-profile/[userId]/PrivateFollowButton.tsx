'use client'
import { useLoginModal } from '@/context/LoginModalContext'
import { useUser } from '@/context/UserContext'
import axios from 'axios'
import {  UserPlus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { GrCheckmark } from 'react-icons/gr'

interface Props {
    receiverId: string
    isRequestSent: boolean
}

const PrivateFollowButton: React.FC<Props> = ({ receiverId, isRequestSent }) => {

    const [requestStatus, setRequestStatus] = useState<'REQUEST' | 'SENT'>('REQUEST');
    const { user } = useUser();
    const { openLoginModal } = useLoginModal();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isRequestSent) {
            setRequestStatus('SENT')
        }
    }, []);

    const handleFollowRequests = async () => {
        if (!user) {
            openLoginModal();
            return;
        }
        const oldStatus = requestStatus;
        setRequestStatus(prev => prev === 'REQUEST' ? 'SENT' : 'REQUEST')

        setLoading(true);
        try {
            const response = await axios({
                url: `/api/private/follow-request`,
                method: 'POST',
                data: {
                    senderId: user?.id,
                    receiverId
                }
            })

        } catch (error) {
            console.log(error)
            setRequestStatus(oldStatus);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={() => { handleFollowRequests() }}
            className="bg-white/10 text-gray-300 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2">

            {
                requestStatus === 'REQUEST' ? <UserPlus size={14} /> : <GrCheckmark size={14}  />
            }
            {
                requestStatus === 'REQUEST' ? 'Request' : 'Sent'
            }
        </button>
    )
}

export default PrivateFollowButton