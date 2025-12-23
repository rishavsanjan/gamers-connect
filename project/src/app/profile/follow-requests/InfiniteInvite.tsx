'use client'
import { timeAgo } from '@/app/utils/date';
import { UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import AcceptDeclineButton from './AcceptDeclineButton';


interface Invites {
    id: string,
    name: string,
    coverImage: string | null,
    createdAt: Date

}

interface Props {
    invites: Invites[]
}

const InfiniteInvites: React.FC<Props> = ({ invites }) => {

    const [invitesState, setInviteState] = useState<Invites[]>(invites);

    return (
        <>


            {
                invitesState.length === 0 ?
                    <span className='text-gray-500 text-center'>No Invites!</span>
                    :
                    <>


                        <div className="flex flex-col gap-4">
                            {invitesState.map((request) => (
                                <div
                                    key={request.id}
                                    className={`group flex flex-col sm:flex-row gap-4 bg-[#1a172e] p-5 rounded-2xl shadow-sm border border-slate-800/50 hover:border-[#3713ec]/50 transition-all  : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-5 flex-1">
                                        {/* Avatar */}
                                        <div className="relative h-[72px] w-[72px] shrink-0">
                                            <div className={` ${request?.coverImage ? '' : 'bg-purple-500 '}w-full h-full rounded-2xl overflow-hidden items-center flex justify-center`}>
                                                {
                                                    request?.coverImage ?
                                                        <>
                                                            <img
                                                                src={request.coverImage}
                                                                alt={request.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </>
                                                        :
                                                        <>
                                                            <h1 className='text-4xl text-center'>{request?.name[0].toUpperCase()}</h1>
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
                                                    {request.name}
                                                </p>
                                                {/* <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20`}>
                                                    {request.xp} XP
                                                </span> */}
                                            </div>
                                            <p className="text-[#9b92c9] text-sm font-medium">
                                                Follow Request
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                {timeAgo(request.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <AcceptDeclineButton senderId={request.id} setInvites={setInviteState} />
                                </div>
                            ))}
                        </div>
                    </>
            }

        </>

    )
}

export default InfiniteInvites