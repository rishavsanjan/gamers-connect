import { Group } from '@prisma/client'
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { handleGroupJoin, handleGroupLeave } from '../utils/community_functions'

interface GroupsExtended extends Group {
  hasJoined: boolean
}

interface Props {
  groups: GroupsExtended[]
}

const GroupsJoinedCard: React.FC<Props> = ({ groups }) => {
  const [loading, setLoading] = useState(false);
  const [groupsState, setGroupsState] = useState<GroupsExtended[]>(groups);

  const handleLeave = async(groupId: string) => {
    setLoading(true)
    try {
      await handleGroupLeave({ groupId, setGroupsState });
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async(groupId: string) => {
    setLoading(true)
    try {
      await handleGroupJoin({ groupId, setGroupsState });
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  console.log(loading)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-3">
      {groupsState.map((group) => (
        <div
          key={group.id}
          className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors duration-200 border border-gray-700"
        >
          {/* Group Info */}
          <div className="flex items-center gap-4 flex-1">
            {/* Group Avatar/Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {group.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Group Name */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg truncate">
                {group.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {group.hasJoined ? 'Member' : 'Not joined'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {loading ? (
              <div className="w-24 h-10 flex items-center justify-center">
                <ClipLoader color='#3B82F6' size={20} />
              </div>
            ) : group.hasJoined ? (
              <button
                onClick={() => handleLeave(group.id)}
                className="px-6 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200 border border-gray-600"
              >
                Joined
              </button>
            ) : (
              <button
                onClick={() => handleJoin(group.id)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Join
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {groupsState.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-gray-400 text-lg font-medium">No groups available</h3>
          <p className="text-gray-500 text-sm mt-2">Check back later for new groups to join</p>
        </div>
      )}
    </div>
  )
}

export default GroupsJoinedCard