'use client'
import { Group } from '@prisma/client'
import axios from 'axios'
import { GroupIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

interface GroupsFormatted extends Group {
    hasJoined: boolean
}

interface Props {
    groups: GroupsFormatted[]
}

const SuggestedGroups: React.FC<Props> = ({ groups }) => {
    const [loading, setLoading] = useState(false);
    const [groupsState, setGroupsState] = useState<GroupsFormatted[]>(groups);


    const handleGroupJoin = async (groupId: string) => {
        setLoading(true)
        try {
            const response = await axios({
                url: `/api/private/group/group-join`,
                method: 'post',
                data: {
                    groupId
                }
            })

            console.log(response.data);
            setGroupsState(prev =>
                prev.map((group) => {
                    if (group.id === groupId) {
                        return {
                            ...group,
                            hasJoined: true
                        }
                    }
                    return group;
                })
            )
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    console.log(groupsState)

    return (
        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
            <h3 className="mb-4 text-lg font-bold ">Suggested Groups</h3>
            {
                groupsState?.map((group) => (
                    <div key={group.id} className='flex flex-row items-center justify-between gap-4'>
                        <Link href={`/group/${group.id}`} key={group.id}>
                            <span>{group.name}</span>
                        </Link>

                        <button
                            onClick={() => { handleGroupJoin(group.id) }}
                            className=" rounded-md p-1 px-4 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold transition hover:from-purple-700 hover:to-pink-700 items-center flex "

                        >
                            {loading ? <ClipLoader color='white' size={20} /> : group.hasJoined ? 'Joined' : 'Join'}
                        </button>
                    </div>
                ))
            }
            <Link href={'/community/create-group'}>
                <button
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold transition hover:from-purple-700 hover:to-pink-700 mt-4"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New Group</span>
                </button>
            </Link>

        </div>
    )
}

export default SuggestedGroups