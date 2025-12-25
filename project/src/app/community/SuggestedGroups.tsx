'use client'
import { Group } from '@prisma/client'
import axios from 'axios'
import {  Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaUsers } from 'react-icons/fa'
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

            if (group.privacy === 'PRIVATE') {
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
        <div className="bg-white dark:bg-[#1E1538] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Suggested Groups</h3>
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5">
                <div className="p-3 bg-gray-200 dark:bg-white/10 rounded-full">
                    <FaUsers/>
                </div>
                <p className="text-sm text-gray-500 dark:text-[#A799CC] px-4">Find groups matching your interests or create your own!</p>
            </div>
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
                <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-2.5 px-4 rounded-xl ease-in-out duration-200 transition-all shadow-lg  flex items-center justify-center gap-2">
                    <Plus className='text-sm' />
                    Create New Group
                </button>
            </Link>

        </div>
    )
}

export default SuggestedGroups