'use client'
import { Post } from '@/app/types/post'
import AddPostModal from '@/components/community/AddPostModal'
import React, { useState } from 'react'
import InfiniteGroupPosts from './InfiniteGroupPosts'
import InfiniteGroupMedia from './InfiniteGroupMedia'
import { Post as PostPrisma } from '@prisma/client'
import GroupAsideBar from './GroupAsideBar'
import InfiniteGroupMembers from './InfiniteGroupMembers'
import { PostFeedProvider } from '@/context/PostsContext'
import InfiniteGroupRequests from './InfiniteGroupRequests'
import { useGroupDetails } from '@/context/GroupsContext'

interface Props {
    groupId: string
    posts: Post[]
    postCount24hrs: number
    postCount30Days: number
    postsWithMedia: PostPrisma[]
    mediaCount: number
    members: Array<{
        name: string | null,
        username: string,
        id: string,
        avatar: string | null,
        role?: 'admin' | 'member'
    }>
    currentUserId?: string,
    currentUserRole?: string
}

const GroupTabs: React.FC<Props> = ({ groupId, posts, postCount24hrs, postCount30Days, postsWithMedia, mediaCount, members, currentUserId, currentUserRole }) => {

    const [activeTab, setActiveTab] = useState('Posts');
    const { groupRequests, memberCount } = useGroupDetails()
    const tabs = currentUserRole === 'owner' || currentUserRole === 'admin' ? ['Posts', 'Members', 'Media', 'Group Requests'] : ['Posts', 'Members', 'Media'];
    return (
        <div>

            <nav className="border-b border-[#3a3b3c] ">
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
                            
                            {tab}{tab === 'Group Requests' && <>{' '}({groupRequests.length}){' '}</>}{tab === 'Media' && <>{' '}({mediaCount}){' '}</>}{tab === 'Members' && <>{' '}({memberCount}){' '}</>}
                            {activeTab === tab && (
                                <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#2374e1]" />
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Content Area */}
            <div className="h-[calc(100vh-120px)] ">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 h-full pb-10">
                    {/* Main Content */}
                    <div className="flex flex-col gap-4 lg:overflow-y-auto pr-1 hide-scrollbar pt-4">
                        {/* Active Tab */}
                        {
                            activeTab === 'Posts' &&
                            <>
                                {/* Post Composer */}
                                <AddPostModal groupId={groupId} />
                                <PostFeedProvider initialPosts={posts}>
                                    <InfiniteGroupPosts groupId={groupId} />
                                </PostFeedProvider>


                            </>

                        }
                        {
                            activeTab === 'Media' &&
                            <InfiniteGroupMedia posts={postsWithMedia} groupId={groupId} />
                        }
                        {
                            activeTab === 'Members' &&
                            <>
                                <InfiniteGroupMembers members={members} groupId={groupId} currentUserId={currentUserId} currentUserRole={currentUserRole} />
                            </>
                        }
                        {
                            activeTab === 'Group Requests' &&
                            <>
                                <InfiniteGroupRequests />
                            </>
                        }

                    </div>

                    {/* Sidebar */}
                    <div className="sticky top-6 self-start h-fit pt-4">
                        <GroupAsideBar postCount24hrs={postCount24hrs} postCount30Days={postCount30Days} mediaCount={mediaCount} />
                    </div>

                </div>
            </div>


        </div>

    )
}

export default GroupTabs