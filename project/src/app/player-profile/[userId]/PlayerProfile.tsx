'use client'
import React, { useState } from 'react';

import { ProfileTabsData } from '@/app/types/profile';
import GamesByYearChart from '../../../components/graphs/BarChart';
import { getYearFromUnix } from '@/app/utils/date';
import { pickPlatformColor } from '@/app/utils/game_functions';
import { PlatformBar } from '../../../components/graphs/GamePlatform';
import GameGenreChart from '../../../components/graphs/HorizontalGraph';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { Follower } from '@/app/types/follower';
import FollowingCard from '../../../components/FollowingCard';
import ProfileGameList from '@/app/profile/ProfileGameList';
import ProfileCollection from '@/app/profile/ProfileCollection';

interface Props extends ProfileTabsData {
    playlistCount: number
    ownedGamesCount: number
    collectionCount: number
    ratingsCount: number
    follower: Follower[]
    following: Follower[]
    userId: string
}


const PlayerProfileTabs: React.FC<Props> = ({ ratings, mygames, playlist, collection, stats, currentlyPlaying, playlistCount,
    ownedGamesCount,
    collectionCount,
    ratingsCount,
    follower,
    following,
    userId }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false)
    const [playlistGames, setPlaylistGames] = useState(playlist.map(item => item.game));
    const [ownedGames, setOwnedGames] = useState(mygames.map(item => item.game));

    const [ratedgames, setRatedGames] = useState(ratings.map(item => item.game));
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

    const loadMore = async (tab: string) => {

        setLoading(true);
        const response = await axios({
            url: `/api/fetch-player-profile-data?page=${nextPage}&tab=${tab}`,
            method: 'post',
            data: {
                userId
            }
        });
        const games = response.data.games.map((item: any) => { return item.game })
        if (tab === 'myGames') {
            setOwnedGames(prev => [...prev, ...games])
        } else if (tab === 'playlist') {
            setPlaylistGames(prev => [...prev, ...games])
        } else if (tab === 'ratings') {
            setRatedGames(prev => [...prev, ...games])
        }
        setLoading(false);
    }



    return (
        <div className='flex flex-col bg-transparent z-60'>
            <div className='flex md:flex-row flex-wrap gap-8 justify-start p-4 '>
                <div>
                    <button
                        onClick={() => { setActiveTab('overview') }}
                        className={`${activeTab === 'overview' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                    >
                        Overview
                    </button>
                </div>
                <div className='relative '>
                    <button
                        onClick={() => { setActiveTab('playlist') }}
                        className={`${activeTab === 'playlist' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                    >Playlist</button>
                    <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{playlistCount || 0}</span>
                </div>

                <div className='relative '>
                    <button
                        onClick={() => { setActiveTab('owned') }}
                        className={`${activeTab === 'owned' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                    >Owned</button>
                    <span className='absolute -top-3 -right-4 text-gray-500 font-extralight'>{ownedGamesCount || 0}</span>

                </div>

                <div className='relative '>
                    <button
                        onClick={() => { setActiveTab('ratings') }}
                        className={`${activeTab === 'ratings' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                    >Ratings</button>
                    <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{ratingsCount || 0}</span>

                </div>

                <div className='relative '>
                    <button
                        onClick={() => { setActiveTab('collection') }}
                        className={`${activeTab === 'collection' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                    >Collection</button>
                    <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{collectionCount || 0}</span>

                </div>



                <div className='relative '>
                    <button
                        onClick={() => { setActiveTab('follower') }}
                        className={`${activeTab === 'follower' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                    >Followers
                    </button>
                    <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{follower.length || 0}</span>

                </div>

                <div className='relative '>
                    <button
                        onClick={() => { setActiveTab('following') }}
                        className={`${activeTab === 'following' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                    >Following
                    </button>
                    <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{following.length || 0}</span>

                </div>


            </div>

            {
                activeTab === 'playlist' &&
                <div className='pb-8 flex flex-col  sm:items-center'>
                    {/* @ts-ignore */}
                    <ProfileGameList gamesList={playlistGames} />
                    <div className={`${playlistCount === playlistGames.length && 'bg-transparent hover:bg-transparent'} hover:bg-[#FFFFFF] px-12 py-2 self-center bg-[#282828] hover:text-black ease-in-out duration-300 transition-all`}>
                        {
                            loading ?

                                <ClipLoader color='gray' />
                                :
                                <>
                                    {
                                        playlistCount !== playlistGames.length &&
                                        < button onClick={() => {
                                            setNextPage(prev => prev + 1);
                                            loadMore('playlist');
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
                <div className='pb-8 flex flex-col sm:items-center '>
                    {/* @ts-ignore */}
                    <ProfileGameList gamesList={ownedGames} />
                    <div className={`${ownedGamesCount === ownedGames.length && 'bg-transparent hover:bg-transparent'} hover:bg-[#FFFFFF] px-12 py-2 self-center bg-[#282828] hover:text-black ease-in-out duration-300 transition-all`}>
                        {
                            loading ?

                                <ClipLoader color='gray' />
                                :
                                <>
                                    {
                                        ownedGamesCount !== ownedGames.length &&
                                        < button onClick={() => {
                                            setNextPage(prev => prev + 1);
                                            loadMore('myGames');
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
                <div className='pb-8 flex flex-col  sm:items-center'>
                    {/* @ts-ignore */}
                    <ProfileGameList gamesList={ratedgames} />
                    <div className={`${ratingsCount === ratedgames.length && 'bg-transparent hover:bg-transparent'} hover:bg-[#FFFFFF] px-12 py-2 self-center bg-[#282828] hover:text-black ease-in-out duration-300 transition-all`}>
                        {
                            loading ?

                                <ClipLoader color='gray' />
                                :
                                <>
                                    {
                                        ratingsCount !== ratedgames.length &&
                                        < button onClick={() => {
                                            setNextPage(prev => prev + 1);
                                            loadMore('ratings');
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
                        follower.map((user) => {
                            return (
                                <FollowingCard user={user} />
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
                                <FollowingCard user={user} />
                            )
                        })
                    }
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



        </div>

    )
}

export default PlayerProfileTabs