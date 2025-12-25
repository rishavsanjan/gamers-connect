'use client'
import { timeAgo } from '@/app/utils/date'
import { Trash2, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import AcceptDeclineButton from './AcceptDeclineButton'
import axios from 'axios'
import { useUser } from '@/context/UserContext'
import Link from 'next/link'

interface Requests {
    id: string,
    name: string | null,
    username: string,
    avatar: string | null,
    xp: number,
    createdAt: Date

}

interface Props {
    requests: Requests[]
}

const InfiniteRequests: React.FC<Props> = ({ requests }) => {

    const [requestsState, setRequestsState] = useState<Requests[]>(requests);
    const { user } = useUser();

    return (
        <>


            {
                requestsState.length === 0 ?
                    <span className='text-gray-500 text-center'>No requests!</span>
                    :
                    <>


                        <div className="flex flex-col gap-4">
                            {requestsState.map((request) => (
                                <div
                                    key={request.id}
                                    className={`group flex flex-col sm:flex-row gap-4 bg-[#1a172e] p-5 rounded-2xl shadow-sm border border-slate-800/50 hover:border-[#3713ec]/50 transition-all  : ''
                                        }`}
                                >
                                    <Link className="flex items-start gap-5 flex-1" href={`/player-profile/${request.id}`} key={request.id}>
                                        {/* Avatar */}
                                        <div className="relative h-[72px] w-[72px] shrink-0">
                                            <div className={` ${request?.avatar ? '' : 'bg-purple-500 '}w-full h-full rounded-2xl overflow-hidden items-center flex justify-center`}>
                                                {
                                                    request?.avatar ?
                                                        <>
                                                            <img
                                                                src={request.avatar}
                                                                alt={request.username}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </>
                                                        :
                                                        <>
                                                            <h1 className='text-4xl text-center'>{request?.username[0].toUpperCase()}</h1>
                                                        </>
                                                }

                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-[#1a172e]`}>
                                                <UserPlus size={14} />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col justify-center gap-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-white text-lg font-bold leading-tight">
                                                    {request.username}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20`}>
                                                    {request.xp} XP
                                                </span>
                                            </div>
                                            <p className="text-[#9b92c9] text-sm font-medium">
                                                Follow Request
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                {timeAgo(request.createdAt)}
                                            </div>
                                        </div>
                                    </Link>



                                    {/* Action Buttons */}
                                    <AcceptDeclineButton senderId={request.id} setRequests={setRequestsState} tab='request' />
                                </div>
                            ))}
                        </div>
                    </>
            }

        </>

    )
}

export default InfiniteRequests