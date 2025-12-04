import React from 'react'
import { Game } from '@/app/types/game';
import { formatUnixDate } from '@/app/utils/date';
import { AddMyGameButton } from '../AddMyGameButton';

interface LeftSideProps {
    game: Game
}

const LeftSide: React.FC<LeftSideProps> = async ({ game }) => {
    return (
        <div className='z-100 w-full md:w-[60%] flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 md:p-8'>
            {/* Release Date Badge */}
            <div className='bg-white self-start rounded-sm p-0.5 px-2'>
                <p className='font-extralight text-black text-xs sm:text-sm'>{formatUnixDate(game.first_release_date)}</p>
            </div>

            {/* Game Title */}
            <div>
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>{game.name}</h1>
            </div>

            {/* Add to My Games Button */}
            <div className='w-full sm:w-auto'>
                <AddMyGameButton game={game} />
            </div>

            {/* Rating Section */}
            <div className='flex flex-row gap-3 sm:gap-4 items-start'>
                <div className='flex flex-col gap-2 border-r border-gray-600 pr-3 sm:pr-4'>
                    <p className='border border-green-400 text-green-400 px-2 py-0.5 w-fit text-sm sm:text-base font-semibold'>
                        {game?.total_rating?.toFixed(0) || 'N/A'}
                    </p>
                    <p className='underline text-xs sm:text-sm text-gray-300'>{game.rating_count} Ratings</p>
                </div>
                {game.total_rating > 80 && (
                    <div className='flex items-center'>
                        <p className='text-lg sm:text-xl md:text-2xl'>Exceptional🎯</p>
                    </div>
                )}
            </div>

            {/* About Section */}
            <div className='space-y-2'>
                <h2 className='text-2xl sm:text-3xl font-bold'>About</h2>
                <p className='line-clamp-6 sm:line-clamp-8 md:line-clamp-10 text-white font-normal sm:font-medium text-sm sm:text-base leading-relaxed'>
                    {game?.storyline || game?.summary || 'N/A'}
                </p>
            </div>

            {/* Game Details Grid */}
            <div>
                <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                    <li className="flex flex-col gap-1">
                        <span className='text-gray-500 text-xs sm:text-sm font-medium'>Platforms</span>
                        <span className='text-white line-clamp-3 sm:line-clamp-4 text-sm sm:text-base'>
                            {game?.platforms?.map((platform) => platform.name).join(', ') || 'N/A'}
                        </span>
                    </li>
                    <li className="flex flex-col gap-1">
                        <span className='text-gray-500 text-xs sm:text-sm font-medium'>Metascore</span>
                        <span className='border border-green-400 text-green-400 px-2 py-0.5 w-fit text-sm sm:text-base font-semibold'>
                            {game?.total_rating?.toFixed(0) || 'N/A'}
                        </span>
                    </li>
                    <li className='flex flex-col gap-1'>
                        <span className='text-gray-500 text-xs sm:text-sm font-medium'>Genre</span>
                        <span className='text-white text-sm sm:text-base'>
                            {game?.genres?.map((genre) => genre.name).join(', ') || 'N/A'}
                        </span>
                    </li>
                    <li className='flex flex-col gap-1'>
                        <span className='text-gray-500 text-xs sm:text-sm font-medium'>Release date</span>
                        <span className='text-white text-sm sm:text-base'>{formatUnixDate(game.first_release_date)}</span>
                    </li>
                    <li className='flex flex-col gap-1 sm:col-span-2'>
                        <span className='text-gray-500 text-xs sm:text-sm font-medium'>Publisher</span>
                        <span className='text-white text-sm sm:text-base line-clamp-2'>
                            {game?.involved_companies?.map((company) => company?.company?.name || 'N/A').join(', ')}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LeftSide