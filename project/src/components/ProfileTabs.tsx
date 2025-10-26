'use client'
import React, { useState } from 'react';

import { ProfileTabsData } from '@/app/types/profile';
import ProfileGameList from './ProfileGameList';

interface Props extends ProfileTabsData { }


const ProfileTabs: React.FC<Props> = ({ ratings, mygames, playlist, collection }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const playlistGames = playlist.map(item => item.game);
    const ownedgames = mygames.map(item => item.game);
    const ratedgames = ratings.map(item => item.game)
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row gap-8 justify-start p-4'>
                <button
                    onClick={() => { setActiveTab('overview') }}
                    className={`${activeTab === 'overview' ? 'border-b border-white text-white' : ''} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Overview</button>
                <button
                    onClick={() => { setActiveTab('playlist') }}
                    className={`${activeTab === 'playlist' ? 'border-b border-white text-white' : ''} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Playlist</button>
                <button
                    onClick={() => { setActiveTab('owned') }}
                    className={`${activeTab === 'owned' ? 'border-b border-white text-white' : ''} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Owned</button>
                <button
                    onClick={() => { setActiveTab('ratings') }}
                    className={`${activeTab === 'ratings' ? 'border-b border-white text-white' : ''} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Ratings</button>
                <button
                    onClick={() => { setActiveTab('collection') }}
                    className={`${activeTab === 'collection' ? 'border-b border-white text-white' : ''} ease-in-out transition-all duration-300 text-gray-500 font-medium text-xl`}
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
        </div>

    )
}

export default ProfileTabs