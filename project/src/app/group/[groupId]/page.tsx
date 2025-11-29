import React, { useState } from 'react';
import { Lock} from 'lucide-react';
import GroupTabs from './GroupTabs';
import { prisma } from '@/lib/db';
import GroupHeader from './GroupHeader';
import { auth } from '@/auth';
import AddPostModal from '@/components/community/AddPostModal';
import InfiniteGroupPosts from './InfiniteGroupPosts';

interface Props {
    params: {
        groupId: string
    }
}

const GroupPage: React.FC<Props> = async ({ params }) => {
    const { groupId } = await params;

    const session = await auth();

    const group = await prisma.group.findFirst({
        where: {
            id: groupId
        },
        include: {
            members: {
                where: {
                    id: session?.user.id
                },
                select: {
                    id: true
                }
            }
        }
    })

    const getposts = await prisma.post.findMany({
        where: {
            groupId
        },
        include: {

            game: {
                select: {
                    name: true,
                    igdb_id: true
                }
            },
            user: {
                select: {
                    name: true,
                    id: true,
                    username: true
                }
            },
            group: {
                select: { name: true, id: true }
            },
            Like: {
                where: { userId: session!.user.id }
            }
        },

        orderBy: { createdAt: 'desc' }
    })


    const posts = getposts.map((post) => ({
        id: post.id,
        description: post.description,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        hasLiked: post.Like.length > 0,
        user: post.user,
        game: post.game,
        createdAt: post.createdAt,
        mediaUrls: post.mediaUrls,
        gameId: post.gameId,
        userId: post.userId,
        updatedAt: post.updatedAt,
        type: post.type,
        group: post.group
    }));

    if (!group) {
        return;
    }

    const hasJoined = group.members.length > 0;

    const members = await prisma.group.findMany({
        take: 5,
        where: {
            id: groupId
        },
        include: {
            members: {
                select: { username: true }
            }
        }
    })


    const formattedNames = members.flatMap(item =>
        item.members.map(member => member.username[0].toUpperCase())
    );

    const postCount24hrs = await prisma.post.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // last 24 hours
            },
            groupId
        }
    });

    const postCount30Days = await prisma.post.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // last 30 days
            },
            groupId
        }
    });


    console.log(group)




    return (
        <div className="min-h-screen bg-[#18191a] text-[#e4e6eb]">
            {/* Header Banner */}
            <div
                className="w-full h-[350px] bg-cover bg-center relative"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(24,25,26,0.9)), url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1400&h=350&fit=crop')`
                }}
            />

            {/* Main Container */}
            <div className="max-w-[1100px] mx-auto px-5">
                {/* Group Header */}
                <GroupHeader group={{ ...group, hasJoined }} members={formattedNames} memberCount={group.memberCount} />

                {/* Navigation Tabs */}
                <GroupTabs />

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 pb-10">
                    {/* Main Content */}
                    <div className="flex flex-col gap-4">
                        {/* Post Composer */}
                        <AddPostModal groupId={groupId} />

                        {/* Posts */}
                        <InfiniteGroupPosts groupId={group.id} initialPosts={posts} />
                    </div>

                    {/* Sidebar */}
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
                                <Lock size={20} />
                                <div className="flex-1">
                                    <div className="text-[15px] font-semibold mb-0.5">Private</div>
                                    <div className="text-[13px] text-[#b0b3b8]">
                                        Only members can see who's in the group
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Media Card */}
                        <div className="bg-[#242526] rounded-lg p-4">
                            <h3 className="text-[17px] font-semibold mb-3">Recent Media</h3>
                            <p className="text-[#b0b3b8]">2,341 photos · 487 videos</p>
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
                </div>
            </div>
        </div>
    );
};

export default GroupPage;