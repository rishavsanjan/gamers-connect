import React, { useState } from 'react';
import { Lock } from 'lucide-react';
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
                    username: true,
                    avatar: true
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
                select: { username: true, id: true, name: true, avatar: true }
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

    const postWithMedia = await prisma.post.findMany({
        take: 2,
        where: {
            groupId,
            mediaUrls: {
                isEmpty: false
            }
        }
    })

    const mediaCount = await prisma.post.count({
        where: {
            groupId,
            mediaUrls: {
                isEmpty: false
            }
        }
    })

    const formattedMembers = members.flatMap(item => item.members);




    console.log(formattedMembers)




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
                <GroupTabs groupId={groupId} posts={posts} group={group} postCount24hrs={postCount24hrs} postCount30Days={postCount30Days} postsWithMedia={postWithMedia} mediaCount={mediaCount} members={formattedMembers} />

            </div>
        </div>
    );
};

export default GroupPage;