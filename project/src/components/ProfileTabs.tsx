'use client'
import React, { useState } from 'react';

import { ProfileTabsData } from '@/app/types/profile';
import ProfileGameList from './ProfileGameList';
import ProfileCollection from './ProfileCollection';
import GamesByYearChart from './graphs/BarChart';
import { getYearFromUnix } from '@/app/utils/date';
import { pickPlatformColor } from '@/app/utils/game_functions';
import { PlatformBar } from './graphs/GamePlatform';
import GameGenreChart from './graphs/HorizontalGraph';

interface Props extends ProfileTabsData { }


const ProfileTabs: React.FC<Props> = ({ ratings, mygames, playlist, collection }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const playlistGames = playlist.map(item => item.game);
    const ownedgames = mygames.map(item => item.game);
    const ratedgames = ratings.map(item => item.game);
    const yearCount = mygames.reduce<Record<number, number>>((acc, item) => {
        if (!item.game.first_release_date) return acc;

        const year = getYearFromUnix(parseInt(item.game.first_release_date));
        acc[year] = (acc[year] || 0) + 1;

        return acc;
    }, {});

    const platformCount = mygames.reduce<Record<string, number>>((acc, item) => {
        if (!item.owned_platform) return acc;

        acc[item.owned_platform] = (acc[item.owned_platform] || 0) + 1;

        return acc;
    }, {});

    const platformData = Object.entries(platformCount).map(([name, count]) => ({
        name,
        count,
        color: pickPlatformColor(name),
    }));

    const genreCount = mygames.reduce<Record<string, number>>((acc, item) => {
        //@ts-ignore
        item.game.genres.map((c) => {
            acc[c.name] = (acc[c.name] || 0) + 1;
        })

        return acc;
    }, {});

    const genreData = Object.entries(genreCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const currentlyPlayingData = mygames.filter((item) => item.status === 'PLAYING');
    const currentlyPlaying = currentlyPlayingData.map((item) => { return item.game })


    return (
        <div className='flex flex-col'>
            <div className='flex flex-row gap-8 justify-start p-4 '>
                <button
                    onClick={() => { setActiveTab('overview') }}
                    className={`${activeTab === 'overview' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Overview</button>
                <button
                    onClick={() => { setActiveTab('playlist') }}
                    className={`${activeTab === 'playlist' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Playlist</button>
                <button
                    onClick={() => { setActiveTab('owned') }}
                    className={`${activeTab === 'owned' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Owned</button>
                <button
                    onClick={() => { setActiveTab('ratings') }}
                    className={`${activeTab === 'ratings' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Ratings</button>
                <button
                    onClick={() => { setActiveTab('collection') }}
                    className={`${activeTab === 'collection' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Collection</button>
            </div>
            {
                activeTab === 'playlist' &&
                //@ts-ignore
                <ProfileGameList gamesList={playlistGames} />
            }
            {
                activeTab === 'owned' &&
                //@ts-ignore
                <ProfileGameList gamesList={ownedgames} />
            }
            {
                activeTab === 'ratings' &&
                //@ts-ignore
                <ProfileGameList gamesList={ratedgames} />
            }
            {
                activeTab === 'collection' &&
                //@ts-ignore
                <ProfileCollection collections={collection} />
            }
            {
                activeTab === 'overview' &&
                <div className='flex flex-col gap-8'>
                    <div className='p-4 px-8 text-3xl flex flex-col gap-2'>
                        <span>Game Platforms</span>
                        <PlatformBar data={platformData} />
                    </div>
                    <div className='p-4 px-8  flex flex-col gap-2'>
                        <span>Currently Playing</span>
                        {
                            currentlyPlaying.length > 0 ?
                                <>
                                    {/* @ts-ignore */}

                                    < ProfileGameList gamesList={currentlyPlaying} />

                                </>
                                :
                                <span>Nothing playing currently!</span>

                        }

                    </div>
                    <GamesByYearChart yearCount={yearCount} />
                    <div className='p-4 px-8 text-3xl flex flex-col gap-2'>
                        <GameGenreChart data={genreData} />
                    </div>
                </div>
            }
        </div>

    )
}

export default ProfileTabs