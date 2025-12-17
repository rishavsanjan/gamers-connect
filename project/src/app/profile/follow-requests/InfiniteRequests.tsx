'use client'
import { timeAgo } from '@/app/utils/date'
import { Trash2, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import AcceptDeclineButton from './AcceptDeclineButton'
import axios from 'axios'
import { useUser } from '@/context/UserContext'

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

    const handleDeclineAll = async () => {
        try {
            const response = await axios({
                url: `/api/private/follow-group-requests/follow-request-accept`,
                method: 'post',
                data: {
                    receiverId: user?.id
                }
            })

            setRequestsState([]);

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
                    disabled={requestsState.length === 0}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[#292348] hover:bg-[#38315e] text-white text-sm font-bold transition-colors disabled:cursor-not-allowed">
                    <Trash2 size={18} />
                    <span className="truncate">Decline All</span>
                </button>
            </header >
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
                                    <div className="flex items-start gap-5 flex-1">
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
                                    </div>

                                    {/* Action Buttons */}
                                    <AcceptDeclineButton senderId={request.id} setRequests={setRequestsState} />
                                </div>
                            ))}
                        </div>
                    </>
            }
            {/* Page Header */}

        </>

    )
}

export default InfiniteRequests