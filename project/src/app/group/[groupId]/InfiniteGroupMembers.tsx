import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Crown, Shield, UserMinus, MoreVertical } from 'lucide-react'
import axios from 'axios'
import { GrUpgrade } from 'react-icons/gr'
import { FcDownRight } from 'react-icons/fc'
import { useGroupDetails } from '@/context/GroupsContext'
import Link from 'next/link'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { fetchGroupMembers } from '@/app/queries/posts'
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'
import { handleAdminCreate, handleKickMember } from '@/app/queries/group'
import MemberCard from './MemberCard'

interface Member {
    name: string | null
    username: string
    id: string
    avatar: string | null
    role?: 'admin' | 'member'
}

interface Props {
    members: Member[]
    groupId: string
    currentUserId?: string
    currentUserRole?: string,
}

const InfiniteGroupMembers: React.FC<Props> = ({
    members,
    groupId,
    currentUserId,
    currentUserRole,

}) => {

    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const { membersState, setMembersState, setMemberCount, groupState } = useGroupDetails();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['group-members', groupId],
        queryFn: fetchGroupMembers,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 30
    });

    useEffect(() => {
        if (!data) return

        const allMembers: Member[] = data.pages.flatMap(p => p.users)
        setMembersState(allMembers)
    }, [data, setMembersState])

    const lastPostRef = useInfiniteScroll(isFetchingNextPage, hasNextPage ?? false, fetchNextPage);

    const kickMemberMutation = useMutation({
        mutationFn: async (memberId: string) => {
            await handleKickMember({ memberId, groupId });
        },
        onSuccess: (_data, memberId: string) => {
            setMembersState(prev => prev.filter(m => m.id !== memberId));
            setMemberCount(prev => prev - 1)
            setOpenMenuId(null)
        }
    });

    const adminCreateMutation = useMutation({
        mutationFn: async (memberId: string) => {
            await handleAdminCreate({ memberId, groupId });
        },
        onSuccess: (_data, memberId: string) => {
            setMembersState(prev => prev.map((member) => {
                if (member.id === memberId) {
                    return {
                        ...member,
                        role: 'admin'
                    }
                } else {
                    return member;
                }
            }))
        }
    });



    const demoteAdminMutation = useMutation({
        mutationFn: async (memberId: string) => {
            await handleAdminCreate({ memberId, groupId });
        },
        onSuccess: (_data, memberId: string) => {
            setMembersState(prev => prev.map((member) => {
                if (member.id === memberId) {
                    return {
                        ...member,
                        role: 'member'
                    }
                } else {
                    return member;
                }
            }))
        }
    });

    const handleKick = (memberId: string) => {
        kickMemberMutation.mutate(memberId)
    }

    const createAdmin = (memberId: string) => {
        adminCreateMutation.mutate(memberId)
    }

    const demoteAdmin = (memberId: string) => {
        demoteAdminMutation.mutate(memberId)
    }


    const kicking = kickMemberMutation.isPending;

    const promoting = adminCreateMutation.isPending;

    const demoting = demoteAdminMutation.isPending;



    return (
        <div className="space-y-3">
            {membersState.map((member, index) => {
                const isLastMember = index === membersState.length - 1


                return (
                    <div
                        key={member.id}
                        ref={isLastMember ? lastPostRef : null}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                    >
                        <MemberCard member={member} ownerId={groupState.ownerId} />



                        {/* Actions */}
                        {((currentUserRole === 'admin' || currentUserRole === 'owner') && currentUserId !== member.id && member.id !== groupState.ownerId) && (
                            <div className="relative">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                    disabled={kicking}
                                >
                                    <MoreVertical size={20} className="text-gray-400" />
                                </button>

                                {openMenuId === member.id && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setOpenMenuId(null)}
                                        />
                                        <div className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                                            <button
                                                onClick={() => handleKick(member.id)}
                                                disabled={kicking}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <UserMinus size={16} />
                                                {kicking ? 'Removing...' : 'Remove from group'}
                                            </button>
                                            {
                                                (currentUserRole === 'owner' && member.role === 'member') &&
                                                (
                                                    <button
                                                        onClick={() => createAdmin(member.id)}
                                                        disabled={currentUserId === member.id}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-green-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <GrUpgrade size={16} />
                                                        {promoting ? 'Promoting.' : 'Promote'}
                                                    </button>
                                                )
                                            }
                                            {
                                                (currentUserRole === 'owner' && member.role === 'admin') &&
                                                (
                                                    <button
                                                        onClick={() => demoteAdmin(member.id)}
                                                        disabled={currentUserId === member.id}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <FcDownRight size={16} />
                                                        {demoting ? 'Demoting.' : 'Demote'}
                                                    </button>
                                                )
                                            }

                                        </div>

                                    </>
                                )}
                            </div>
                        )}

                        {member.id === currentUserId && (
                            <span className="text-gray-500 text-sm px-3">You</span>
                        )}
                    </div>
                )
            })}

            {isLoading && (
                <div className="flex items-center justify-center py-4">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {!hasNextPage && membersState.length > 0 && (
                <p className="text-center text-gray-500 py-4">No more members to load</p>
            )}

            {!isLoading && membersState.length === 0 && (
                <p className="text-center text-gray-500 py-8">No members found</p>
            )}
        </div>
    )
}

export default InfiniteGroupMembers