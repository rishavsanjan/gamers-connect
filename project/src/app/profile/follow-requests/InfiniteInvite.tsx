'use client'
import { timeAgo } from '@/app/utils/date';
import React, { useEffect, useState } from 'react';
import AcceptDeclineButton from './AcceptDeclineButton';
import { FcInvite } from 'react-icons/fc';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchInvites } from '@/app/queries/requests';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';


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
    console.log(invitesState)
    const { user } = useUser();
    if (!user) {
        return null;
    }
    const userId = user.id;
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['invite-requests-recieved', userId],
        queryFn: fetchInvites,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 30 * 1000
    });

    useEffect(() => {
        if (!data) return;

        const allRequests: Invites[] = data.pages.flatMap(r => r.invites);
        setInviteState(allRequests);
    }, [data]);

    const lastPostRef = useInfiniteScroll(isFetchingNextPage, hasNextPage ?? false, fetchNextPage);

    return (
        <>


            {
                <>
                    {
                        invitesState.length > 0 &&
                        <div className="flex flex-col gap-4">
                            {invitesState.map((request) => (
                                <div
                                    key={request.id}
                                    className={`group flex flex-col sm:flex-row gap-4 bg-[#1a172e] p-5 rounded-2xl shadow-sm border border-slate-800/50 hover:border-[#3713ec]/50 transition-all  justify-between: ''
                                        }`}
                                >

                                    <Link className="flex items-start gap-5 flex-1" href={`/group/${request.id}`} key={request.id}>
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
                                                <FcInvite size={14} />
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
                                                Group invite
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                {timeAgo(request.createdAt)}
                                            </div>
                                        </div>
                                    </Link>


                                    {/* Action Buttons */}
                                    <AcceptDeclineButton groupId={request.id} setInvites={setInviteState} tab='invite' />
                                </div>
                            ))}
                        </div>
                    }

                    <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">

                        {!hasNextPage && <p className='text-gray-500 text-lg font-serif'>No more invites!</p>}
                    </div>
                </>
            }

        </>

    )
}

export default InfiniteInvites