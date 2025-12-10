import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Crown, Shield, UserMinus, MoreVertical } from 'lucide-react'
import axios from 'axios'
import { Group } from '@prisma/client'

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
    group:Group
}

const InfiniteGroupMembers: React.FC<Props> = ({
    members,
    groupId,
    currentUserId,
    currentUserRole,
    group
}) => {
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [membersState, setMembersState] = useState(members)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [kickingUserId, setKickingUserId] = useState<string | null>(null)

    const observer = useRef<IntersectionObserver | null>(null)

    const lastPostRef = useCallback((node: HTMLDivElement) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1)
            }
        })

        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const getMembers = async () => {
        setLoading(true)
        try {
            const response = await axios({
                url: `/api/get-group-members?page=${page}`,
                method: 'post',
                data: {
                    groupId
                }
            })

            const data = response.data;
            const newMembers = data.users;

            if (page === 1) {
                setMembersState(newMembers)
            } else {
                setMembersState(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const uniqueMembers = newMembers.filter((member: Member) => !existingIds.has(member.id))
                    return [...prev, ...uniqueMembers]
                })
            }

            if (newMembers.length === 0) {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Failed to fetch members:', error)
        } finally {
            setLoading(false)
        }
    }

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

            setMembersState(prev => prev.filter(m => m.id !== memberId))
            setOpenMenuId(null)
        } catch (error) {
            console.error('Failed to kick member:', error)
            alert('Failed to remove member. Please try again.')
        } finally {
            setKickingUserId(null)
        }
    }

    const canKickMember = (memberRole: string) => {
        if (currentUserRole === 'owner') return true
        if (currentUserRole === 'admin' && memberRole === 'member') return true
        return false
    }

    useEffect(() => {
        if (page === 1) return
        getMembers()
    }, [page])

    const getInitials = (name: string | null, username: string) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        }
        return username.slice(0, 2).toUpperCase()
    }

    const getRoleBadge = (role: string) => {
        if (role === 'OWNER') {
            return (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                    <Crown size={12} />
                    Owner
                </div>
            )
        }
        if (role === 'ADMIN') {
            return (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                    <Shield size={12} />
                    Admin
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-3">
            {membersState.map((member, index) => {
                const isLastMember = index === membersState.length - 1
                const canKick = canKickMember(member.role || 'MEMBER') && member.id !== currentUserId

                return (
                    <div
                        key={member.id}
                        ref={isLastMember ? lastPostRef : null}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                    >
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
                                        member.id === group.ownerId && 'OWNER' &&
                                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                                            <Crown size={12} />
                                            Owner
                                        </div>
                                    }
                                    {
                                        getRoleBadge(member.role || 'MEMBER')
                                    }
                                </div>
                                <p className="text-gray-400 text-sm truncate">
                                    @{member.username}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        {canKick && (
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
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                                            <button
                                                onClick={() => handleKickMember(member.id)}
                                                disabled={kickingUserId === member.id}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <UserMinus size={16} />
                                                {kickingUserId === member.id ? 'Removing...' : 'Remove Member'}
                                            </button>
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