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
    const [loading, setLoading] = useState<string | null>(null);
    const [groupsState, setGroupsState] = useState<GroupsFormatted[]>(groups);


    const handleGroupJoin = async (group: GroupsFormatted) => {
        setLoading(group.id)
        const groupId = group.id;
        try {
            if (group.privacy === 'PUBLIC') {
                const response = await axios({
                    url: `/api/private/group/group-join`,
                    method: 'post',
                    data: {
                        groupId: group.id
                    }
                })
            }

            if(group.privacy === 'PRIVATE'){
                await axios({
                url: `/api/private/follow-group-requests/group-request-send`,
                method: 'post',
                data: {
                    groupId: group.id
                }
            })
            }

            setGroupsState(prev =>
                prev.map((group) => {
                    if (group.id === groupId) {
                        return {
                            ...group,
                            hasJoined: !group.hasJoined
                        }
                    }
                    return group;
                })
            )
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(null)
        }

    }

    


    return (
        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg gap-2 flex flex-col">
            <h3 className="mb-4 text-lg font-bold ">Suggested Groups</h3>
            {
                groupsState?.map((group) => (
                    <div key={group.id} className='flex flex-row items-center justify-between  '>
                        <Link href={`/group/${group.id}`} key={group.id}>
                            <span>{group.name}</span>
                        </Link>
                        {
                            group.privacy === 'PRIVATE' ?
                                <button
                                    onClick={() => { handleGroupJoin(group) }}
                                    className=" rounded-md p-1 px-4 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold transition hover:from-purple-700 hover:to-pink-700 items-center flex cursor-pointer"

                                >
                                    {loading === group.id ? <ClipLoader color='white' size={20} /> : !group.hasJoined ? 'Request' : 'Cancel'}
                                </button>

                                :
                                <button
                                    onClick={() => { handleGroupJoin(group) }}
                                    className=" rounded-md p-1 px-4 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold transition hover:from-purple-700 hover:to-pink-700 items-center flex cursor-pointer"

                                >
                                    {loading === group.id ? <ClipLoader color='white' size={20} /> : group.hasJoined ? 'Leave' : 'Join'}
                                </button>
                        }

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