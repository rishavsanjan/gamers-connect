import React from 'react'
import { Game } from '@/app/types/game';
import { formatUnixDate } from '@/app/utils/date';
import { IoGameController } from 'react-icons/io5';
import { AddMyGameButton } from '../AddMyGameButton';
import { prisma } from "@/lib/prisma";
import RatingSlider from '../RatingSlider';

interface LeftSideProps {
    game: Game
}

const LeftSide: React.FC<LeftSideProps> = async ({ game }) => {





    return (
        <div className='z-100 md:w-[70%] w-full flex flex-col gap-4 p-8'>
            <div className='bg-white self-start rounded-sm p-0.5 px-2'>
                <p className='font-extralight text-black text-sm '> {formatUnixDate(game.first_release_date)}</p>
            </div>
            <div>
                <p className='text-6xl font-bold'>{game.name}</p>
            </div>
            <div className=''>
                <AddMyGameButton game={game} />

            </div>
           
            <div className='flex flex-row gap-4'>
                <div className='flex flex-col gap-2 border-r border-gray-600 pr-4'>
                    <p className='border border-green-400 text-green-400 px-1 w-fit'>{game?.total_rating?.toFixed(0) || 'N/A'}</p>
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
                        <span className='text-white'>{game?.platforms?.map((platform) => platform.name).join(', ')}</span>

                    </li>
                    <li className="flex flex-col">
                        <span className='text-gray-500'>Metascore</span>
                        <span className='border border-green-400 text-green-400 px-1 w-fit'>{game?.total_rating?.toFixed(0) || 'N/A'}</span>
                    </li>
                    <li className='flex flex-col'>
                        <span className='text-gray-500'>Genre</span>
                        <span className='text-white'>{game?.genres?.map((genre) => genre.name).join(', ')}</span>
                    </li>
                    <li className='flex flex-col'>
                        <span className='text-gray-500'>Release date</span>
                        <span className='text-white'>{formatUnixDate(game.first_release_date)}</span>
                    </li>
                    <li className='flex flex-col'>
                        <span className='text-gray-500'>Publisher</span>
                        <span className='text-white'>{game?.involved_companies?.map((company) => company?.company?.name || 'N/A').join(', ')}</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LeftSide