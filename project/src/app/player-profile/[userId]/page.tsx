import { auth } from '@/auth'
import { prisma } from '@/lib/prisma';
import React from 'react';
import { ProfileTabsData } from '../../types/profile';
import PlayerProfileTabs from '@/app/player-profile/[userId]/PlayerProfile';
import FollowCard from './FollowCard';

interface Props {
    params: {
        userId: string
    }
}

const PlayerProfile: React.FC<Props> = async ({ params }) => {
    const { userId } = await params;
    const session = await auth();
    if (!session?.user.username) {
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            name: true,
            username: true,
            id: true
        }
    });

    if (!user) {
        return;
    }

    let [ratings, mygames, playlist, collection] = await Promise.all([
        prisma.rating.findMany({
            where: { userId: userId },
            take: 10,
            include: {
                game: {
                    include: {
                        genres: true,
                        platforms: true
                    }
                }
            },
        }),
        prisma.myGame.findMany({
            where: { userId: userId },
            take: 10,
            include: {
                game: {
                    include: {
                        genres: true,
                        platforms: true,
                    },
                },
            },
        }),
        prisma.playlist.findMany({
            where: { userId: userId },
            take: 10,
            include: {
                game: {
                    include: {
                        genres: true,
                        platforms: true
                    }
                }
            },
        }),
        prisma.collection.findMany({
            where: { userId: userId },
            include: {
                games: {
                    include: {
                        genres: true,
                        platforms: true
                    }
                }
            },
        }),
    ]);

    const allMyGamesForStats = await prisma.myGame.findMany({
        where: { userId: userId },
        select: {
            owned_platform: true,
            status: true,
            game: {
                select: {
                    id: true,
                    first_release_date: true,
                    genres: { select: { name: true } },
                    platforms: { select: { name: true } },
                },
            },
        },
    });

    const currentlyPlaying = await prisma.myGame.findMany({
        where: { userId: userId, status: 'PLAYING' },
        include: {
            game: {
                include: {
                    genres: true,
                    platforms: true
                }
            }
        },
    });



    const followersWithoutFormatting = await prisma.follow.findMany({
        where: {
            followingId: userId,
        },
        include: {
            follower: {
                select: {
                    name: true,
                    username: true,
                    id: true
                }
            }
        },
    });

    const followerIds = followersWithoutFormatting.map(f => f.followerId);

    const myFollows = await prisma.follow.findMany({
        where: {
            followerId: userId,
            followingId: { in: followerIds },
        },
        select: { followingId: true },
    });

    const myFollowingSet = new Set(myFollows.map(f => f.followingId));



    const followers = followersWithoutFormatting.map(f => ({
        ...f.follower,
        isFollowingBack: myFollowingSet.has(f.followerId),
    }));

    console.log(followers)


    const followingWithoutFormatting = await prisma.follow.findMany({
        where: {
            followerId: userId,
        },
        include: {
            following: {
                select: {
                    name: true,
                    username: true,
                    id: true
                }
            }
        },
    });

    const following = followingWithoutFormatting.map((item) => {
        return { ...item.following, isFollowingBack: true };
    })



    console.log(following)



    const playlistCount = await prisma.playlist.count({
        where: {
            userId: userId
        }
    })

    const ownedGamesCount = await prisma.myGame.count({
        where: {
            userId: userId
        }
    })
    const collectionCount = await prisma.collection.count({
        where: {
            userId: userId
        }
    })
    const ratingsCount = await prisma.rating.count({
        where: {
            userId: userId
        }
    })

    const isFollowing = !!await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: session.user.id,
                followingId: userId
            }
        }
    })


    //@ts-ignore
    const profileData: ProfileTabsData = { ratings, mygames, playlist, collection, stats: allMyGamesForStats, currentlyPlaying };




    return (
        <div>
            <div className='flex flex-row items-center gap-16 justify-center'>
                <div className='flex items-center flex-row '>
                    <div className='bg-purple-500 p-4 m-4 w-18 h-18 rounded-full'>
                        <h1 className='text-4xl text-center'>{ user?.username[0].toUpperCase() ?? 'A'}</h1>
                    </div>
                    <h1 className='text-5xl'>{user.name ?? user.username ?? 'Anynomus'}</h1>
                </div>
                <div>
                    <FollowCard isFollowing={isFollowing} userId={userId}/>
                </div>

            </div>

            <PlayerProfileTabs userId={userId} {...profileData} playlistCount={playlistCount} ownedGamesCount={ownedGamesCount} collectionCount={collectionCount} ratingsCount={ratingsCount} follower={followers} following={following} />
        </div>
    )
}

export default PlayerProfile