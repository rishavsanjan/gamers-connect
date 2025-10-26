'use client'
import YouTubePlayer from '@/app/utils/ytplayer';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { ProfileGame } from '@/app/types/game';
interface GameProps {
    gamesList: ProfileGame[]
}



const ProfileGameList: React.FC<GameProps> = ({ gamesList }) => {
    const [hoverId, setHoverId] = useState<number>(0);





    function formatUnixDate(timestamp: number): string {
        const date = new Date(timestamp * 1000); // Convert seconds → milliseconds
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    }

    return (
        <div
            className='grid grid-cols-1 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2  gap-8 p-4   rounded-xl   Z-100'
        >
            {
                gamesList.map((game, index) => {
                    const imgUrl = game.cover
                        ? `https:${game.cover.replace("t_thumb", "t_screenshot_med")}`
                        : "/placeholder.jpg";
                    let xboxCount = 0;
                    let playStationCount = 0;
                    return (
                        <div onMouseEnter={() => { setHoverId(game.id) }} onMouseLeave={() => { setHoverId(0) }} key={game.id} className='flex flex-col min-w-[335px] overflow-hidden shadow-lg shrink-0 rounded-xl hover:scale-105 duration-300 ease-in-out'>
                            {/* <div>
                                {
                                    game?.videos?.length > 0 && hoverId === game.id &&
                                    <div className='relative'>
                                        <YouTubePlayer videoId={game?.videos[0].video_id || 'N/A'} />

                                        <div className='absolute bottom-2 border border-white left-3 rounded-md p-0.5  hover:bg-white/30 ease-in-out transition-all duration-300'>
                                            <Link href={`https://www.youtube.com/embed/${game?.videos[0].video_id}`} target='_blank'>
                                                <button className='cursor-pointer'>Play Full Video</button>
                                            </Link>
                                        </div>
                                    </div>

                                }
                                {
                                    hoverId !== game.id &&
                                    
                                }



                            </div> */}
                            <img className='w-full h-[188px] ' src={`${imgUrl}`} alt="" />

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
                                    <Link href={`/details/${game.id}`} key={game.id}>
                                        <p onClick={() => { }} className='text-xl w-80 font-[var(--font-dm-sans)] font-bold hover:text-gray-400 hover:cursor-pointer'>{index + 1}.{' '} {game?.name || 'N/A'}</p>
                                    </Link>

                                </div>
                                {
                                    hoverId === game.id &&
                                    <div className='flex flex-col gap-4 w-80'>
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
                            </div>

                        </div>
                    )

                })
            }
        </div>
    )
}

export default ProfileGameList