'use client'
import Link from 'next/link';
import React, {  useState } from 'react';
import { ProfileGame } from '@/app/types/game';

interface GameProps {
    gamesList: ProfileGame[]
}

const ProfileGameList: React.FC<GameProps> = ({ gamesList }) => {
    const [hoverId, setHoverId] = useState<number>(0);
    const [selectedId, setSelectedId] = useState(0);

    function formatUnixDate(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    }

    return (
        <div className='flex flex-col items-center'>
            <div
                className="
         grid grid-cols-1
         min-[750px]:grid-cols-2
         min-[1120px]:grid-cols-3
         min-[1458px]:grid-cols-4
         min-[1850px]:grid-cols-5
         gap-8 p-4 rounded-xl 
    "
            >
                {
                    gamesList.map((game, index) => {
                        const imgUrl = game.cover
                            ? `https:${game.cover.replace("t_thumb", "t_screenshot_med")}`
                            : "/placeholder.jpg";
                        let xboxCount = 0;
                        let playStationCount = 0;
                        let nitendoCount = 0;

                        return (
                            <div
                                onMouseEnter={() => { setHoverId(game.id) }}
                                onMouseLeave={() => { setHoverId(0) }}
                                key={game.id}
                                className='flex flex-col min-w-[355.7px] overflow-visible shadow-lg shrink-0 rounded-xl hover:scale-105 duration-300 ease-in-out relative sm:z-10 sm:hover:z-50'
                            >
                                <img className='w-full h-[188px] rounded-t-xl' src={`${imgUrl}`} alt="" />

                                <div className='bg-[#202020] p-2 gap-2 flex flex-col rounded-b-xl '>
                                    <div className='flex flex-row justify-between'>
                                        <div className='flex flex-row gap-2 '>
                                            {
                                                game?.platforms?.map((platform) => {
                                                    let platformLogo;

                                                    if (platform.id === 'cmh4mke2y0009hye9y5zx92lj') {
                                                        platformLogo = 'https://img.icons8.com/?size=100&id=38805&format=png&color=FFFFFF'
                                                    } else if (platform.id === 'cmh7wwpxr0005lhcztkozsgpi') {
                                                        platformLogo = 'https://img.icons8.com/?size=100&id=XaIQdSh4y3F9&format=png&color=FFFFFF'
                                                    } else if ((platform.id === 'cmh4mke2y0008hye9whbiksah' || platform.id === 'cmh4mke2y000ahye9o9p6s8in' || platform.id === 'cmh60qlwm0003m7e9hnl3eoyn') && playStationCount === 0) {
                                                        platformLogo = 'https://img.icons8.com/?size=100&id=12519&format=png&color=FFFFFF'
                                                        playStationCount++;
                                                    } else if ((platform.id === 'cmh4mke2y0007hye9z321fuzo' || platform.id === 'cmh4mke2y000chye9vf2msova' || platform.id === 'cmh60qlwm0005m7e9dng4rvsy') && xboxCount === 0) {
                                                        platformLogo = 'https://img.icons8.com/?size=100&id=12504&format=png&color=FFFFFF'
                                                        xboxCount++;
                                                    } else {
                                                        return;
                                                    }
                                                    return (
                                                        <div className='' key={platform.id}>
                                                            <img className='w-5 h-5 object-fill' src={`${platformLogo}`} alt="" />
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                        <div className='border border-green-400 text-green-400 px-1'>
                                            {game?.total_rating?.toFixed(0) || 'N/A'}
                                        </div>
                                    </div>

                                    <div className=''>
                                        <Link href={`/details/${game.igdb_id}`} key={game.igdb_id}>
                                            <p onClick={() => { }} className='text-xl w-80 font-[var(--font-dm-sans)] font-bold hover:text-gray-400 hover:cursor-pointer'>{index + 1}.{' '} {game?.name || 'N/A'}</p>
                                        </Link>

                                    </div>
                                    {
                                        selectedId !== game.id ?
                                            <button
                                                onClick={() => setSelectedId(game.id)}
                                                className='border-b border-gray-400 self-center text-sm sm:hidden '>
                                                View More
                                            </button>

                                            :

                                            <button
                                                onClick={() => setSelectedId(0)}
                                                className='border-b border-gray-400 self-center text-sm sm:hidden '>
                                                View Less
                                            </button>

                                    }

                                    {
                                        selectedId === game.id &&
                                        <div className='flex  flex-col gap-4 w-80'>
                                            <div className='transition-opacity duration-300 opacity-100 '>
                                                <span className='line-clamp-3  text-gray-300 font-medium'>{game?.storyline || game?.summary || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <ul className='grid grid-rows-1'>
                                                    <li>
                                                        <span className='text-gray-400  text-xs font-mono'>Release Date : </span>

                                                        <span className='text-white  text-xs font-mono'>{formatUnixDate(game.first_release_date)}</span>

                                                    </li>
                                                    <li>
                                                        <span className='text-gray-400  text-xs font-mono'>Genres : </span>
                                                        <span className='text-white text-xs font-mono '>  {game?.genres?.map((genre) => genre.name).join(', ')}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                    }


                                    <div className='relative sm:flex hidden'>
                                        {hoverId === game.id && (
                                            <div className='absolute   bg-[#202020] p-2 rounded-b-xl shadow-2xl z-50 min-w-[355.7px] -left-2'>
                                                <div className='flex flex-col gap-4 w-full'>
                                                    <div className='transition-opacity duration-300 opacity-100'>
                                                        <span className='line-clamp-3 text-gray-300 font-medium'>{game?.storyline || game?.summary || 'N/A'}</span>
                                                    </div>
                                                    <div>
                                                        <ul className='grid grid-rows-1'>
                                                            <li>
                                                                <span className='text-gray-400 text-xs font-mono'>Release Date : </span>
                                                                <span className='text-white text-xs font-mono'>{formatUnixDate(game.first_release_date)}</span>
                                                            </li>
                                                            <li>
                                                                <span className='text-gray-400 text-xs font-mono'>Genres : </span>
                                                                <span className='text-white text-xs font-mono'>{game?.genres?.map((genre) => genre.name).join(', ')}</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}

export default ProfileGameList