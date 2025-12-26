import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Crown, Shield, UserMinus, MoreVertical } from 'lucide-react'
import axios from 'axios'
import { GrUpgrade } from 'react-icons/gr'
import { FcDownRight } from 'react-icons/fc'
import { useGroupDetails } from '@/context/GroupsContext'
import Link from 'next/link'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchGroupMembers } from '@/app/queries/posts'
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'

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

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [kickingUserId, setKickingUserId] = useState<string | null>(null);

    const { membersState, setMembersState, setMemberCount, groupState } = useGroupDetails();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['group-members',groupId],
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

    // const observer = useRef<IntersectionObserver | null>(null)

    // const lastPostRef = useCallback((node: HTMLDivElement) => {
    //     if (loading) return
    //     if (observer.current) observer.current.disconnect()

    //     observer.current = new IntersectionObserver(entries => {
    //         if (entries[0].isIntersecting && hasMore) {
    //             setPage(prev => prev + 1)
    //         }
    //     })

    //     if (node) observer.current.observe(node)
    // }, [loading, hasMore])

    // const getMembers = async () => {
    //     setLoading(true)
    //     try {
    //         const response = await axios({
    //             url: `/api/get-group-members?page=${page}`,
    //             method: 'post',
    //             data: {
    //                 groupId
    //             }
    //         })

    //         const data = response.data;
    //         const newMembers = data.users;

    //         if (page === 1) {
    //             setMembersState(newMembers)
    //         } else {
    //             setMembersState(prev => {
    //                 const existingIds = new Set(prev.map(p => p.id))
    //                 const uniqueMembers = newMembers.filter((member: Member) => !existingIds.has(member.id))
    //                 return [...prev, ...uniqueMembers]
    //             })
    //         }

    //         if (newMembers.length === 0) {
    //             setHasMore(false)
    //         }
    //     } catch (error) {
    //         console.error('Failed to fetch members:', error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleKickMember = async (memberId: string) => {

        setKickingUserId(memberId)
        try {
            const response = await axios({
                url: `/api/private/group/group-kick-member`,
                method: 'post',
                data: {
                    groupId,
                    memberId
                }
            })

            setMembersState(prev => prev.filter(m => m.id !== memberId));
            setMemberCount(prev => prev - 1)
            setOpenMenuId(null)
        } catch (error) {
            console.error('Failed to kick member:', error)
            alert('Failed to remove member. Please try again.')
        } finally {
            setKickingUserId(null)
        }
    }

    // const canKickMember = (memberRole: string) => {
    //     if (currentUserRole === 'owner') return true
    //     if (currentUserRole === 'admin' && memberRole === 'member') return true
    //     return false
    // }

    // useEffect(() => {
    //     getMembers()
    // }, [page])

    const getInitials = (name: string | null, username: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
        return username.slice(0, 2).toUpperCase()
    }

    const getRoleBadge = (role: string) => {
        if (role === 'owner') {
            return (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                    <Crown size={12} />
                    Owner
                </div>
            )
        }
        if (role === 'admin') {
            return (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                    <Shield size={12} />
                    Admin
                </div>
            )
        }
        return null
    }

    const handleAdminCreate = async (memberId: string) => {
        try {
            const response = await axios({
                url: `/api/private/group/group-admin-create`,
                method: 'post',
                data: {
                    groupId,
                    memberId
                }
            });

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


        } catch (error) {
            console.log(error)
        }

    }

    const handleAdminRemove = async (memberId: string) => {
        try {
            const response = await axios({
                url: `/api/private/group/group-admin-remove`,
                method: 'post',
                data: {
                    groupId,
                    memberId
                }
            });

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


        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="space-y-3">
            {membersState.map((member, index) => {
                const isLastMember = index === membersState.length - 1
                // const canKick = canKickMember(member.role || 'member') && member.id !== currentUserId && (currentUserRole === 'admin' || currentUserRole === 'owner')

                return (
                    <div
                        key={member.id}
                        ref={isLastMember ? lastPostRef : null}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                    >
                        <Link href={`/player-profile/${member.id}`} key={member.id}>
                            <div className="flex items-center gap-3 flex-1">
                                {/* Avatar */}
                                <div className="relative">
                                    {member.avatar ? (
                                        <img
                                            src={member.avatar}
                                            alt={member.name || member.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                            {getInitials(member.name, member.username)}
                                        </div>
                                    )}
                                </div>

                                {/* Member Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-white font-medium truncate">
                                            {member.name || member.username}
                                        </h3>
                                        {
                                            member.id === groupState.ownerId && 'owner' &&
                                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                                                <Crown size={12} />
                                                Owner
                                            </div>
                                        }
                                        {
                                            getRoleBadge(member.role || 'member')
                                        }
                                    </div>
                                    <p className="text-gray-400 text-sm truncate">
                                        @{member.username}
                                    </p>
                                </div>

                            </div>
                        </Link>



                        {/* Actions */}
                        {((currentUserRole === 'admin' || currentUserRole === 'owner') && currentUserId !== member.id && member.id !== groupState.ownerId) && (
                            <div className="relative">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                                    disabled={kickingUserId === member.id}
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
                                                onClick={() => handleKickMember(member.id)}
                                                disabled={kickingUserId === member.id}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <UserMinus size={16} />
                                                {kickingUserId === member.id ? 'Removing...' : 'Remove from group'}
                                            </button>
                                            {
                                                (currentUserRole === 'owner' && member.role === 'member') &&
                                                (
                                                    <button
                                                        onClick={() => handleAdminCreate(member.id)}
                                                        disabled={currentUserId === member.id}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-green-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <GrUpgrade size={16} />
                                                        {kickingUserId === member.id ? 'Promoting.' : 'Promote'}
                                                    </button>
                                                )
                                            }
                                            {
                                                (currentUserRole === 'owner' && member.role === 'admin') &&
                                                (
                                                    <button
                                                        onClick={() => handleAdminRemove(member.id)}
                                                        disabled={currentUserId === member.id}
                                                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <FcDownRight size={16} />
                                                        {kickingUserId === member.id ? 'Demoting.' : 'Demote'}
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

            {loading && (
                <div className="flex items-center justify-center py-4">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {!hasMore && membersState.length > 0 && (
                <p className="text-center text-gray-500 py-4">No more members to load</p>
            )}

            {!loading && membersState.length === 0 && (
                <p className="text-center text-gray-500 py-8">No members found</p>
            )}
        </div>
    )
}

export default InfiniteGroupMembers