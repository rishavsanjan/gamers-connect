import { Crown, Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Member {
    name: string | null
    username: string
    id: string
    avatar: string | null
    role?: 'admin' | 'member' | 'owner'
}


interface Props {
    member: Member,
    ownerId: string
}

const MemberCard: React.FC<Props> = ({ member , ownerId}) => {

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
    return (
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
                            member.id === ownerId && 'owner' &&
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
    )
}

export default MemberCard