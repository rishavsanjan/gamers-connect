'use client'
import { Post } from '@/app/types/post'
import AddPostModal from '@/components/community/AddPostModal'
import React, { useState } from 'react'
import InfiniteGroupPosts from './InfiniteGroupPosts'
import { Lock } from 'lucide-react'
import { Group, User } from '@prisma/client'
import InfiniteGroupMedia from './InfiniteGroupMedia'
import { Post as PostPrisma } from '@prisma/client'
import GroupAsideBar from './GroupAsideBar'
import InfiniteGroupMembers from './InfiniteGroupMembers'

interface Props {
    groupId: string
    posts: Post[]
    group: Group
    postCount24hrs: number
    postCount30Days: number
    postsWithMedia: PostPrisma[]
    mediaCount: number
    members : Array<{
        name:string | null,
        username:string,
        id:string,
        avatar:string | null
    }>
}

const GroupTabs: React.FC<Props> = ({ groupId, posts, group, postCount24hrs, postCount30Days, postsWithMedia, mediaCount, members }) => {
    const [activeTab, setActiveTab] = useState('Posts');

    const tabs = ['Posts', 'Featured', 'Members', 'Media'];
    return (
        <div>
            <nav className="border-b border-[#3a3b3c] mb-5">
                <ul className="flex gap-0">
                    {tabs.map((tab) => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-4 cursor-pointer text-[15px] font-semibold transition-all relative ${activeTab === tab
                                ? 'text-[#2374e1]'
                                : 'text-[#b0b3b8] hover:bg-white/5 hover:text-[#e4e6eb]'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#2374e1]" />
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 pb-10">
                {/* Main Content */}
                <div className="flex flex-col gap-4">


                    {/* Active Tab */}
                    {
                        activeTab === 'Posts' &&
                        <>
                            {/* Post Composer */}
                            <AddPostModal groupId={groupId} />
                            <InfiniteGroupPosts groupId={groupId} initialPosts={posts} />
                        </>

                    }
                    {
                        activeTab === 'Media' &&
                        <InfiniteGroupMedia posts={postsWithMedia} groupId={groupId} />
                    }
                    {
                        activeTab === 'Members' &&
                        <>
                        <InfiniteGroupMembers members={members} groupId={groupId} />
                        </>
                    }

                </div>

                {/* Sidebar */}
                <GroupAsideBar group={group} postCount24hrs={postCount24hrs} postCount30Days={postCount30Days} mediaCount={mediaCount} />
            </div>

        </div>

    )
}

export default GroupTabs