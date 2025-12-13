'use client'
import { Lock, Share2 } from 'lucide-react'
import React from 'react'

import JoinLeaveButton from './JoinLeaveButton'
import { useGroupDetails } from '@/context/GroupsContext'

interface Props {

}

const GroupHeader: React.FC<Props> = ({ }) => {
    const { memberCount, membersState, groupState } = useGroupDetails();
    console.log(membersState)
    console.log(groupState)
    return (
        <div className="py-8 -mt-20 relative z-10">
            <h1 className="text-4xl font-bold mb-2 text-white">{groupState.name}</h1>

            <div className="flex items-center gap-2 text-[#b0b3b8] text-[15px] mb-5">
                <Lock size={16} />
                <span>{groupState.privacy === 'PRIVATE' ? 'Private Group' : 'Public Group'} · {memberCount} Members</span>
            </div>

            <div className="flex mb-5">
                {
                    membersState?.map((member, idx) => (
                        <div
                            key={idx}
                            className="w-9 h-9 rounded-full border-2 border-[#18191a] -ml-2 first:ml-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold"
                        >
                            <span>{member.username[0].toUpperCase()}</span>
                        </div>
                    ))
                }
                {
                    memberCount > 5 &&
                    <div className="w-9 h-9 rounded-full border-2 border-[#18191a] -ml-2 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-semibold">
                        +{memberCount - 5}
                    </div>
                }
            </div>

            {/* Member Avatars */}
            {/* <div className="flex mb-5">
                {members.map((member, idx) => (
                    <div
                        key={idx}
                        className="w-9 h-9 rounded-full border-2 border-[#18191a] -ml-2 first:ml-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold"
                    >
                        {member}
                    </div>
                ))}
                {
                    memberCount > 5 &&
                    <div className="w-9 h-9 rounded-full border-2 border-[#18191a] -ml-2 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-semibold">
                        +{memberCount - 5}
                    </div>
                }
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">

                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#3a3b3c] text-[#e4e6eb] rounded-md font-semibold hover:bg-[#4e4f50] transition-colors">
                    <Share2 size={18} />
                    Share
                </button>
                <JoinLeaveButton groupId={groupState.id} hasJoined={groupState.hasJoined} />
            </div>
        </div>
    )
}

export default GroupHeader