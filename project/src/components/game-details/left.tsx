import React from 'react'
import { Game } from '@/app/types/game';
import { formatUnixDate } from '@/app/utils/date';
import { IoGameController } from 'react-icons/io5';

interface LeftSideProps {
    game: Game
}

const LeftSide: React.FC<LeftSideProps> = ({ game }) => {
    return (
        <div className='z-100 w-[70%] flex flex-col gap-4 p-8'>
            <div className='bg-white self-start rounded-sm p-0.5 px-2'>
                <p className='font-extralight text-black text-sm '> {formatUnixDate(game.first_release_date)}</p>
            </div>
            <div>
                <p className='text-6xl font-bold'>{game.name}</p>
            </div>
            <div className='flex flex-row gap-4'>
                <button className='bg-white rounded-xl p-1 gap-4  flex flex-row  px-8 items-center'>
                    <div>
                        <p className='text-gray-400 text-left text-sm'>Add to</p>
                        <p className='text-black text-lg'>My Games</p>
                    </div>
                    <div>
                        <img className='w-12 h-12' src="https://img.icons8.com/?size=100&id=102544&format=png&color=000000" alt="" />
                    </div>
                </button>
                <button className='bg-transparent rounded-xl p-2 gap-4  flex flex-row justify-between items-center border border-white'>
                    <div>
                        <p className='text-gray-400 text-left'>Add to</p>
                        <p className='text-white '>Playlist</p>
                    </div>
                    <div>
                        <IoGameController className='text-3xl' />
                    </div>
                </button>
            </div>
            <div className='flex flex-row gap-4'>
                <div className='flex flex-col gap-2 border-r border-gray-600 pr-4'>
                    <p className='border border-green-400 text-green-400 px-1 w-fit'>{game.total_rating.toFixed(0)}</p>
                    <p className='underline'>{game.rating_count} Ratings</p>
                </div>
                <div>
                    <p className='text-2xl'>{game.total_rating > 80 && 'Exceptional🎯'}</p>
                </div>
            </div>
            <div>
                <p className='text-3xl font-bold'>About</p>
                <span className='line-clamp-9  text-white font-medium'>{game?.storyline || game?.summary || 'N/A'}</span>
            </div>
            <div>
                <ul className='grid grid-cols-2 gap-4'>
                    <li className="flex flex-col">
                        <span className='text-gray-500'>Platforms</span>
                        <span className='text-white'>{game.platforms.map((platform) => platform.name).join(', ')}</span>

                    </li>
                    <li className="flex flex-col">
                        <span className='text-gray-500'>Metascore</span>
                        <span className='border border-green-400 text-green-400 px-1 w-fit'>{game.total_rating.toFixed(0)}</span>
                    </li>
                    <li className='flex flex-col'>
                        <span className='text-gray-500'>Genre</span>
                        <span className='text-white'>{game.genres.map((genre) => genre.name).join(', ')}</span>
                    </li>
                    <li className='flex flex-col'>
                        <span className='text-gray-500'>Release date</span>
                        <span className='text-white'>{formatUnixDate(game.first_release_date)}</span>
                    </li>
                    <li className='flex flex-col'>
                        <span className='text-gray-500'>Publisher</span>
                        <span className='text-white'>{game.involved_companies.map((company) => company?.company?.name || 'N/A').join(', ')}</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LeftSide