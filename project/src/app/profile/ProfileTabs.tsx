'use client'
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { ProfileTabsData } from '@/app/types/profile';
import ProfileGameList from './ProfileGameList';
import ProfileCollection from './ProfileCollection';
import { getYearFromUnix } from '@/app/utils/date';
import { pickPlatformColor } from '@/app/utils/game_functions';
import { ClipLoader } from 'react-spinners';
import { Post } from '@/app/types/post';
import { Game, Group, User } from '@prisma/client';
import { Follower } from '@/app/types/follower';
import InfiniteProfileBookmarked from '@/components/InfiniteProfileBookmarked';
import { PlatformBar } from '@/components/graphs/GamePlatform';
import GamesByYearChart from '@/components/graphs/BarChart';
import GameGenreChart from '@/components/graphs/HorizontalGraph';
import FollowingCard from '@/components/FollowingCard';
import ProfileAchievements from './ProfileAchievements';
import GroupsJoinedCard from './GroupsJoinedCard';
import InfiniteProfilePosts from '@/components/InfiniteProfilePosts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProfileGames } from '../queries/posts';
import Tabs from './Tabs';
import InitProfilePosts from '@/context/InitProfilePosts';
import InitProfileBookmarkPosts from '@/context/InitBookmarkPosts';
import { useUser } from '@/context/UserContext';

interface GroupsExtended extends Group {
    hasJoined: boolean
}

interface Props extends ProfileTabsData {
    bookmarkedPosts: Post[]
    playlistCount: number
    ownedGamesCount: number
    collectionCount: number
    ratingsCount: number
    bookmarkCount: number
    follower: Follower[]
    following: Follower[]
    achievementsCount: number
    groups: GroupsExtended[]
    groupsCount: number
    posts: Post[]
    postsCount: number
}


const ProfileTabs: React.FC<Props> = ({ ratings, mygames, playlist, collection, stats, currentlyPlaying, bookmarkedPosts, playlistCount,
    ownedGamesCount,
    collectionCount,
    ratingsCount, bookmarkCount, follower, following, achievementsCount, groups, groupsCount, posts, postsCount }) => {



    const [activeTab, setActiveTab] = useState('overview');
    const [playlistGames, setPlaylistGames] = useState(playlist.map(item => item.game));
    const [ownedGames, setOwnedGames] = useState(mygames.map(item => item.game));
    const [followersState, setFollowersState] = useState(follower);
    const [followerCountState, setFollowerCountState] = useState(follower.length)
    const [ratedgames, setRatedGames] = useState(ratings.map(item => item.game));
    const [gameTab, setGameTab] = useState('');
    const { user } = useUser();


    const yearCount = stats.reduce<Record<number, number>>((acc, item) => {
        if (!item.game.first_release_date) return acc;

        const year = getYearFromUnix(parseInt(item.game.first_release_date));
        acc[year] = (acc[year] || 0) + 1;

        return acc;
    }, {});

    const [nextPage, setNextPage] = useState(2);

    const platformCount = stats.reduce<Record<string, number>>((acc, item) => {
        if (!item.owned_platform) return acc;

        acc[item.owned_platform] = (acc[item.owned_platform] || 0) + 1;

        return acc;
    }, {});

    const platformData = Object.entries(platformCount).map(([name, count]) => ({
        name,
        count,
        color: pickPlatformColor(name),
    }));

    const genreCount = stats.reduce<Record<string, number>>((acc, item) => {
        //@ts-ignore
        item.game.genres.map((c) => {
            acc[c.name] = (acc[c.name] || 0) + 1;
        })

        return acc;
    }, {});

    const genreData = Object.entries(genreCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const currentlyPlayingData = currentlyPlaying.filter((item) => item.status === 'PLAYING');
    const playing = currentlyPlayingData.map((item) => { return item.game });

    const { data, isFetchingNextPage, fetchNextPage, hasNextPage, } = useInfiniteQuery({
        queryKey: ['profile-games', gameTab],
        queryFn: fetchProfileGames,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 60,


    })

    useEffect(() => {

        if (!data) return;
        const games: Game[] = data.pages.flatMap(page =>
            //@ts-ignore
            page.games.map(item => item.game)
        );
        console.log(games)
        if (gameTab === 'myGames') {
            setOwnedGames(games)
        } else if (gameTab === 'playlist') {
            setPlaylistGames(games)
        } else if (gameTab === 'ratings') {
            setRatedGames(games)
        }
    }, [gameTab, data]);

    return (
        <div id="profile-scroll" className='flex  flex-col bg-transparent z-60'>
            <Tabs setActiveTab={setActiveTab} setGameTab={setGameTab} activeTab={activeTab} playlistCount={playlistCount} ownedGamesCount={ownedGamesCount} ratingsCount={ratingsCount} postsCount={postsCount} collectionCount={collectionCount} bookmarkCount={bookmarkCount} followerCountState={followerCountState} followingrCountState={following.length} achievementsCount={achievementsCount} groupsCount={groupsCount} />
            {
                activeTab === 'bookmark' &&
                <div className='p-4'>
                    <InitProfileBookmarkPosts posts={bookmarkedPosts} />
                    <InfiniteProfileBookmarked />

                </div>
            }
            {
                activeTab === 'post' &&
                <div className='p-4'>
                    <InitProfilePosts posts={posts} />
                    <InfiniteProfilePosts />

                </div>
            }
            {
                activeTab === 'playlist' &&
                <div className='pb-8 flex flex-col  '>
                    {/* @ts-ignore */}
                    <ProfileGameList gamesList={playlistGames} />
                    <div className='self-center'>
                        {
                            isFetchingNextPage ?

                                <ClipLoader color='gray' />
                                :
                                <>
                                    {
                                        playlistCount !== playlistGames.length &&
                                        < button
                                            className={`${playlistCount === playlistGames.length && 'bg-transparent hover:bg-transparent'} hover:bg-[#FFFFFF] px-12 py-2 self-center bg-[#282828] hover:text-black ease-in-out duration-300 transition-all `}
                                            onClick={() => {
                                                setNextPage(prev => prev + 1);
                                                //loadMore('playlist');
                                                fetchNextPage();

                                            }}>
                                            Load More
                                        </button>
                                    }
                                </>


                        }
                    </div>

                </div>

            }
            {
                activeTab === 'owned' &&
                <div className='pb-8 flex flex-col  '>
                    {/* @ts-ignore */}
                    <ProfileGameList gamesList={ownedGames} />


                    <div className='self-center'>
                        {
                            isFetchingNextPage ?

                                <ClipLoader color='gray' />
                                :
                                <>
                                    {
                                        ownedGamesCount !== ownedGames.length &&
                                        < button
                                            className={`${ownedGamesCount === ownedGames.length && 'bg-transparent hover:bg-transparent'} hover:bg-[#FFFFFF] px-12 py-2 self-center bg-[#282828] hover:text-black ease-in-out duration-300 transition-all`}
                                            onClick={() => {
                                                setNextPage(prev => prev + 1);
                                                //loadMore('myGames');

                                                fetchNextPage();
                                            }}>
                                            Load More
                                        </button>
                                    }
                                </>


                        }
                    </div>


                </div>

            }
            {
                activeTab === 'ratings' &&
                <div className='pb-8 flex flex-col  '>
                    {/* @ts-ignore */}
                    <ProfileGameList gamesList={ratedgames} />
                    <div className='self-center'>
                        {
                            isFetchingNextPage ?

                                <ClipLoader color='gray' />
                                :
                                <>
                                    {
                                        ratingsCount !== ratedgames.length &&
                                        < button
                                            className={`${ratingsCount === ratedgames.length && 'bg-transparent hover:bg-transparent'} hover:bg-[#FFFFFF] px-12 py-2 self-center bg-[#282828] hover:text-black ease-in-out duration-300 transition-all`}
                                            onClick={() => {
                                                setNextPage(prev => prev + 1);
                                                //loadMore('ratings');

                                                fetchNextPage();
                                            }}>
                                            Load More
                                        </button>
                                    }
                                </>


                        }
                    </div>
                </div>


            }
            {
                activeTab === 'collection' &&
                //@ts-ignore
                <ProfileCollection collections={collection} />
            }
            {
                activeTab === 'overview' &&
                <div className='flex flex-col gap-8'>
                    <div className='md:p-4 md:px-8 p-2 text-3xl flex flex-col gap-2'>
                        <span>Game Platforms</span>
                        {
                            platformData.length > 0 ?
                                <PlatformBar data={platformData} />

                                :
                                <span className='text-sm'>Please add games to view data!</span>

                        }
                    </div>
                    <div className='  flex flex-col gap-2 md:px-4 '>
                        <span className='px-4 text-3xl font-semibold'>Currently Playing</span>
                        {
                            playing.length > 0 ?
                                <>
                                    {/* @ts-ignore */}
                                    < ProfileGameList gamesList={playing} />
                                </>
                                :
                                <span className='text-white'>Nothing playing currently!</span>

                        }

                    </div>
                    <GamesByYearChart yearCount={yearCount} />
                    <div className='md:p-4 md:px-8 text-3xl flex flex-col gap-2'>
                        <GameGenreChart data={genreData} />
                    </div>
                </div>
            }

            {
                activeTab === 'follower' &&
                <div className='p-4 px-8  flex flex-row flex-wrap gap-2'>
                    {
                        followersState.map((user) => {
                            return (
                                <FollowingCard user={user} activeTab={activeTab} setFollowers={setFollowersState} setFollowersCount={setFollowerCountState} />
                            )
                        })
                    }
                </div>
            }

            {
                activeTab === 'following' &&
                <div className='p-4 px-8  flex flex-row flex-wrap gap-2'>
                    {
                        following.map((user) => {
                            return (
                                <FollowingCard user={user} activeTab={activeTab} />
                            )
                        })
                    }
                </div>
            }
            {
                activeTab === 'achievements' &&
                <div>
                    <ProfileAchievements />
                </div>
            }
            {
                activeTab === 'groups' &&
                <div>
                    <GroupsJoinedCard groups={groups} />
                </div>
            }
            {
                activeTab === 'playlist' && playlistCount === 0 &&
                <div className='self-center mb-20'>
                    <span className='text-gray-500 text-xl'>No games in playlist!</span>
                </div>
            }
            {
                activeTab === 'owned' && ownedGamesCount === 0 &&
                <div className='self-center mb-20'>
                    <span className='text-gray-500 text-xl'>No games owned!</span>
                </div>
            }
            {
                activeTab === 'ratings' && ratings.length === 0 &&
                <div className='self-center mb-20'>
                    <span className='text-gray-500 text-xl'>No games rated!</span>
                </div>
            }
            {
                activeTab === 'collection' && collectionCount === 0 &&
                <div className='self-center mb-20'>
                    <span className='text-gray-500 text-xl'>No games in collection!</span>
                </div>
            }
            {
                activeTab === 'bookmark' && bookmarkCount === 0 &&
                <div className='self-center mb-20'>
                    <span className='text-gray-500 text-xl'>No posts bookmarked!</span>
                </div>
            }

            {
                activeTab === 'post' && postsCount === 0 &&
                <div className='self-center mb-20'>
                    <span className='text-gray-500 text-xl'>No posts!</span>
                </div>
            }

        </div >

    )
}

export default ProfileTabs