'use client'

import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import InfiniteRequests from './InfiniteRequests';
import InfiniteInvites from './InfiniteInvite';

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
    requests: Requests[]
    invites: Invites[]
}

const Tabs: React.FC<Props> = ({ requests, invites }) => {
    const [activeFilter, setActiveFilter] = useState('request');
    const { user } = useUser();

    const handleDeclineAll = async () => {
        try {
            const response = await axios({
                url: `/api/private/follow-group-requests/follow-request-accept`,
                method: 'post',
                data: {
                    receiverId: user?.id
                }
            })


        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            < header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/60" >
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Pending Requests
                    </h1>
                    <p className="text-[#9b92c9] text-lg font-normal max-w-xl">
                        Manage your incoming follow requests.
                    </p>
                </div>
                <button
                    onClick={handleDeclineAll}
                    disabled={requests.length === 0}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[#292348] hover:bg-[#38315e] text-white text-sm font-bold transition-colors disabled:cursor-not-allowed">
                    <Trash2 size={18} />
                    <span className="truncate">Decline All</span>
                </button>
            </header >
            <div className='flex flex-row gap-4'>
                <button
                    onClick={() => {setActiveFilter('request')}}
                    className={`flex h-9 items-center justify-center gap-2 rounded-lg px-4 transition-colors ${activeFilter === 'request'
                        ? 'bg-[#3713ec] text-white'
                        : 'bg-[#292348] text-slate-300 hover:bg-[#38315e]'
                        }`}
                >
                    <p className="text-sm font-medium">Follow Requests</p>
                </button>
                <button
                    onClick={() => {setActiveFilter('invite')}}
                    className={`flex h-9 items-center justify-center gap-2 rounded-lg px-4 transition-colors ${activeFilter === 'invite'
                        ? 'bg-[#3713ec] text-white'
                        : 'bg-[#292348] text-slate-300 hover:bg-[#38315e]'
                        }`}
                >
                    <p className="text-sm font-medium">Group Invites</p>
                </button>
            </div>
            {
                activeFilter === 'request' &&
                <InfiniteRequests requests={requests} />
            }
            {
                activeFilter === 'invite' &&
                <InfiniteInvites invites={invites} />
            }
        </>

    )
}

export default Tabs