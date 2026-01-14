import React, { SetStateAction } from 'react'

interface Props {
    handleTabChange: (newTab:string) => void
    setGameTab: React.Dispatch<SetStateAction<string>>
    activeTab: string
    playlistCount: number
    ownedGamesCount: number
    ratingsCount: number
    postsCount: number
    collectionCount: number
    bookmarkCount: number
    followerCountState: number
    followingrCountState: number
    achievementsCount: number
    groupsCount: number

}

const Tabs: React.FC<Props> = ({ handleTabChange, setGameTab, activeTab, ownedGamesCount, ratingsCount, postsCount, collectionCount, bookmarkCount, followerCountState, followingrCountState, achievementsCount, groupsCount, playlistCount }) => {
    return (
        <div className='flex md:flex-row flex-wrap gap-8 justify-start p-4 '>
            <div>
                <button
                    onClick={() => { handleTabChange('overview') }}
                    className={`${activeTab === 'overview' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >
                    Overview
                </button>
            </div>
            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('playlist'); setGameTab('playlist') }}
                    className={`${activeTab === 'playlist' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Playlist</button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{playlistCount || 0}</span>
            </div>

            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('owned'); setGameTab('myGames') }}
                    className={`${activeTab === 'owned' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Owned</button>
                <span className='absolute -top-3 -right-4 text-gray-500 font-extralight'>{ownedGamesCount || 0}</span>

            </div>

            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('ratings'); setGameTab('ratings') }}
                    className={`${activeTab === 'ratings' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Ratings</button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{ratingsCount || 0}</span>

            </div>
            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('post') }}
                    className={`${activeTab === 'post' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Posts
                </button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{postsCount || 0}</span>

            </div>

            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('collection') }}
                    className={`${activeTab === 'collection' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Collection</button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{collectionCount || 0}</span>

            </div>

            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('bookmark') }}
                    className={`${activeTab === 'bookmark' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Bookmarks
                </button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{bookmarkCount || 0}</span>

            </div>

            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('follower') }}
                    className={`${activeTab === 'follower' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Followers
                </button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{followerCountState || 0}</span>

            </div>

            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('following') }}
                    className={`${activeTab === 'following' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Following
                </button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{followingrCountState || 0}</span>

            </div>

            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('achievements') }}
                    className={`${activeTab === 'achievements' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Achievements
                </button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{achievementsCount || 0}</span>

            </div>
            <div className='relative '>
                <button
                    onClick={() => { handleTabChange('groups') }}
                    className={`${activeTab === 'groups' ? 'border-b border-white text-white ' : 'hover:border-gray-400 hover:border-b-2 '} ease-in-out cursor-pointer transition-all duration-300 text-gray-500 font-medium text-xl`}
                >Groups
                </button>
                <span className='absolute -top-2 -right-3 text-gray-500 font-extralight'>{groupsCount || 0}</span>

            </div>


        </div>
    )
}

export default Tabs