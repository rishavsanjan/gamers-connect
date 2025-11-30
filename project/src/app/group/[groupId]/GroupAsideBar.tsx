import { Group } from '@prisma/client'
import { Eye, Globe, Lock } from 'lucide-react'
import React from 'react'

interface Props {
    group: Group
    postCount24hrs: number
    postCount30Days: number
    mediaCount: number
}

const GroupAsideBar: React.FC<Props> = ({ group, postCount24hrs, postCount30Days, mediaCount }) => {
    return (
        <aside className="flex flex-col gap-4">
            {/* About Card */}
            <div className="bg-[#242526] rounded-lg p-4">
                <h3 className="text-[17px] font-semibold mb-3">About</h3>
                <p className="text-sm leading-relaxed text-[#b0b3b8] mb-2">
                    {
                        group.description === null ?
                            <>
                                No Description!
                            </>
                            :
                            <>
                                {group.description}
                            </>
                    }
                </p>

                <div className="flex items-center gap-2 p-3 bg-[#3a3b3c] rounded-md mt-3">
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <Globe size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold mb-1"> {group.privacy === 'PUBLIC' ? 'Public' : 'Private'}</p>
                                <p className="text-sm text-gray-400">
                                    {group.privacy === 'PUBLIC' ? "Anyone can see who's in the group and what they post." : 'Only those who joined can see the posts.'}

                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Eye size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold mb-1">{group.visibility === 'VISIBLE' ? 'Visible' : 'Hidden'}</p>
                                <p className="text-sm text-gray-400">
                                    {group.visibility === 'VISIBLE' ? 'Anyone can find this group.' : 'Only people with invite link can find this.'}

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Media Card */}
            <div className="bg-[#242526] rounded-lg p-4">
                <h3 className="text-[17px] font-semibold mb-3">Recent Media</h3>
                <p className="text-[#b0b3b8]">{mediaCount} photos</p>
            </div>

            {/* Activity Card */}
            <div className="bg-[#242526] rounded-lg p-4">
                <h3 className="text-[17px] font-semibold mb-3">Activity</h3>
                <p className="mb-2">
                    <strong>{postCount24hrs} posts today</strong>
                </p>
                <p className="text-[13px] text-[#b0b3b8]">Last 30 days: {postCount30Days} posts</p>
            </div>
        </aside>
    )
}

export default GroupAsideBar