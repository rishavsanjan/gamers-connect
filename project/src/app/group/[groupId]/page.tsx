import React from 'react';
import GroupTabs from './GroupTabs';
import { prisma } from '@/lib/db';
import GroupHeader from './GroupHeader';
import { auth } from '@/auth';
import { GroupDetailsProvider } from '@/context/GroupsContext';
import PrivateGroupPage from './PrivateGroup';


interface Props {
    params: Promise<{ groupId: string }>
}

const GroupPage: React.FC<Props> = async ({ params }) => {
    const { groupId } = await params;
    const session = await auth().catch(() => null);
    const userId = session?.user?.id ?? null;


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

    if (!group) {
        return;
    }

    const hasJoined = group.members.length > 0;

    if (!session?.user) {
        return <PrivateGroupPage group={group} isRequestSent={false} />
    }

    if (!hasJoined && group.privacy === 'PRIVATE') {
        const isRequestSent = (await prisma.groupJoinRequest.count({
            where: {
                userId: session?.user.id,
                groupId
            }
        })) > 0 ? true : false;
        return <PrivateGroupPage group={group} isRequestSent={isRequestSent} />
    }




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
            Like: userId
                ? { where: { userId } }
                : false,
            bookmarks: userId ? {
                where: { userId },
                select: { postId: true }
            } : false

        },
        take:10,

        orderBy: { createdAt: 'desc' }
    })


    const posts = getposts.map((post) => ({
        id: post.id,
        description: post.description,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        hasLiked: userId ? post.Like.length > 0 : false,
        user: post.user,
        game: post.game,
        createdAt: post.createdAt,
        mediaUrls: post.mediaUrls,
        gameId: post.gameId,
        userId: post.userId,
        updatedAt: post.updatedAt,
        type: post.type,
        group: post.group,
        hasBookmarked: userId ? post.bookmarks.length > 0 : false

    }));



    const [members, postCount24hrs, postCount30Days, postWithMedia, mediaCount] = await Promise.all([
        await prisma.group.findMany({
            take: 5,
            where: {
                id: groupId
            },
            include: {
                members: {
                    select: { username: true, id: true, name: true, avatar: true }
                },
                admins: {
                    select: { username: true, id: true, name: true, avatar: true }
                },

            },
        }),

        await prisma.post.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) 
                },
                groupId
            }
        }),
        await prisma.post.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
                },
                groupId
            }
        }),
        await prisma.post.findMany({
            take: 2,
            where: {
                groupId,
                mediaUrls: {
                    isEmpty: false
                }
            }
        }),
        await prisma.post.count({
            where: {
                groupId,
                mediaUrls: {
                    isEmpty: false
                }
            }
        })

    ])

    const admins = members.flatMap(item =>
        item.admins.map(admin => ({
            ...admin,
            role: "admin"
        }))
    );

    const allMembers = members.flatMap(item =>
        item.members.map(member => ({
            ...member,
            role: "member"
        }))
    );

    const roleMap = new Map();

    for (const m of allMembers) {
        roleMap.set(m.id, m);
    }

    for (const a of admins) {
        roleMap.set(a.id, a);
    }

    const finalUsers = Array.from(roleMap.values());

    const currentUserId = session?.user.id;

    let currentUserRole;


    if (!currentUserId) {
        currentUserRole = 'guest';
    } else if (group.ownerId === currentUserId) {
        currentUserRole = 'owner';
    } else {
        const isAdmin = await prisma.group.findFirst({
            where: {
                id: groupId,
                admins: {
                    some: { id: currentUserId }
                }
            },
            select: { id: true }
        });

        currentUserRole = isAdmin ? 'admin' : 'member';
    }

    let requests: any = [];

    if (currentUserRole === 'admin' || currentUserRole === 'owner') {
        const groupRequests = await prisma.groupJoinRequest.findMany({
            where: {
                groupId
            },
            select: {
                user: {
                    select: {
                        id: true,
                        avatar: true,
                        username: true,
                        name: true,
                        xp: true
                    }
                },
                createdAt: true
            }
        });

        requests = groupRequests.map((req) => ({
            ...req.user,
            createdAt: req.createdAt,
        }));
    }



    return (
        <div className="min-h-screen bg-[#18191a] text-[#e4e6eb]">


            {/* Main Container */}
            <div className="max-w-[1100px] mx-auto ">
                <GroupDetailsProvider group={{ ...group, hasJoined }} members={finalUsers} totalMembers={group.memberCount} requests={requests} currentUserRole={currentUserRole}>
                    {/* Group Header */}
                    <GroupHeader />

                    {/* Navigation Tabs */}
                    <GroupTabs groupId={groupId} posts={posts} postCount24hrs={postCount24hrs} postCount30Days={postCount30Days} postsWithMedia={postWithMedia} mediaCount={mediaCount} members={finalUsers} currentUserId={currentUserId} currentUserRole={currentUserRole} />

                </GroupDetailsProvider>



            </div>
        </div>
    );
};

export default GroupPage;