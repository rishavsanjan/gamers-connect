import { auth } from '@/auth'
import { prisma } from '@/lib/prisma';
import React from 'react';
import { ProfileTabsData } from '../../types/profile';
import PlayerProfileTabs from '@/app/player-profile/[userId]/PlayerProfile';
import FollowCard from './FollowCard';
import Link from 'next/link';
import { BsDiscord, BsSteam, BsYoutube } from 'react-icons/bs';
import { Facebook, Instagram, Twitch, Twitter } from 'lucide-react';
import PrivateProfile from './PrivateProfile';
import { Metadata } from 'next';

export async function generateMetadata(
    { params }: { params: Promise< { userId: string }> }
): Promise<Metadata> {
    const { userId } = await params;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            username: true
        }
    })

    return {
        title: user?.username
            ? `${user.username}`
            : "Game Details",
    };
}


const PlayerProfile = async ({ params }: {
    params:Promise< { userId: string }>
}) => {
    const { userId } =await  params;
    const session = await auth().catch(() => null);
    const loggedInId = session?.user.id;


    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            name: true,
            username: true,
            id: true,
            avatar: true,
            socialLinks: true,
            xp: true,
            bio: true,
            privacy: true
        },

    });

    let isFollowing = false;

    if (session?.user.id) {
        isFollowing = !!await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session?.user.id,
                    followingId: userId
                }
            }
        })
    }

    if (!isFollowing && user?.privacy === 'PRIVATE') {
        return (
            <PrivateProfile receiverId={user.id} senderId={loggedInId} />
        )
    }


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
            where: { userId: userId, visibility: 'PUBLIC' },
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



    const [playlistCount, ownedGamesCount, collectionCount, ratingsCount] = await Promise.all([
        prisma.playlist.count({
            where: {
                userId: userId
            }
        }),
        prisma.myGame.count({
            where: {
                userId: userId
            }
        }),
        prisma.collection.count({
            where: {
                userId: userId
            }
        }),
        prisma.rating.count({
            where: {
                userId: userId
            }
        })

    ])


    const socialLinks = user?.socialLinks.filter((item) => {
        if (item.link) {
            return {
                ...item
            }
        }
    })


    //@ts-ignore
    const profileData: ProfileTabsData = { ratings, mygames, playlist, collection, stats: allMyGamesForStats, currentlyPlaying };




    return (
        <div className=''>
            <div className='flex flex-col items-center gap-4'>
                <div className='flex flex-col items-center  justify-center mt-4 gap-4 '>
                    <div className={`${user?.avatar ? '' : 'bg-purple-500 p-4 m-4 w-18 h-18 rounded-full'}  `}>
                        {
                            user?.avatar ?
                                <>
                                    <img src={user.avatar} alt="" className='rounded-full w-24 h-24' />
                                </>
                                :
                                <>
                                    <h1 className='text-4xl text-center'>{user.username[0].toUpperCase()}</h1>
                                </>
                        }

                    </div>
                    <div className='flex items-center flex-row gap-4'>

                        <h1 className='md:text-5xl text-3xl'>{user.username ?? 'Anynomus'}</h1>
                        <div>
                            <FollowCard isFollowing={isFollowing} userId={userId} userPrivacy={user.privacy} />
                        </div>
                    </div>


                </div>
                <div className=' flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-6 py-2.5 backdrop-blur-sm w-fit justify-center self-center'>
                    <div className='flex items-center gap-2  justify-center'>
                        <svg
                            className='w-5 h-5 text-yellow-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                        >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                        <span className='text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'>
                            {user?.xp?.toLocaleString() || '0'}
                        </span>
                        <span className='text-sm text-gray-400 font-medium'>XP</span>
                    </div>
                </div>
            </div>

            {
                user?.bio !== null &&
                <>

                    <div className='w-full p-4'>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Bio</h2>
                        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{user?.bio}</p>
                        </div>
                    </div>
                </>
            }

            {
                socialLinks.length > 0 &&
                <>
                    <div className='w-full p-4'>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Social Links</h2>
                        <div className="flex flex-row gap-4">
                            {
                                socialLinks?.map((item) => (
                                    <>
                                        {
                                            item.type === 'DISCORD' &&
                                            <Link href={item.link} target='_blank'>
                                                <BsDiscord size={30} className=" text-[#9a90cb]" />
                                            </Link>

                                        }

                                        {
                                            item.type === 'YOUTUBE' &&
                                            <Link href={item.link} target='_blank'>
                                                <BsYoutube size={30} className=" text-[#9a90cb]" />
                                            </Link>

                                        }
                                        {
                                            item.type === 'FACEBOOK' &&
                                            <Link href={item.link} target='_blank'>
                                                <Facebook size={30} className=" text-[#9a90cb]" />
                                            </Link>

                                        }

                                        {
                                            item.type === 'INSTAGRAM' &&
                                            <Link href={item.link} target='_blank'>
                                                <Instagram size={30} className=" text-[#9a90cb]" />
                                            </Link>

                                        }
                                        {
                                            item.type === 'TWITCH' &&
                                            <Link href={item.link} target='_blank'>
                                                <Twitch size={30} className=" text-[#9a90cb]" />
                                            </Link>

                                        }

                                        {
                                            item.type === 'X' &&
                                            <Link href={item.link} target='_blank'>
                                                <Twitter size={30} className=" text-[#9a90cb]" />
                                            </Link>

                                        }

                                        {
                                            item.type === 'STEAM' &&
                                            <Link href={item.link} target='_blank'>
                                                <BsSteam size={30} className=" text-[#9a90cb]" />
                                            </Link>

                                        }


                                    </>


                                ))
                            }
                        </div>
                    </div>
                </>
            }


            <PlayerProfileTabs userId={userId} {...profileData} playlistCount={playlistCount} ownedGamesCount={ownedGamesCount} collectionCount={collectionCount} ratingsCount={ratingsCount} follower={followers} following={following} />
        </div>
    )
}

export default PlayerProfile