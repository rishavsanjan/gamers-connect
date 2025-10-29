'use client'
import YouTubePlayer from '@/app/utils/ytplayer';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Game } from '@/app/types/game';
interface GameProps {
    gamesList: Game[]
}



const GamesList: React.FC<GameProps> = ({ gamesList }) => {
    const [hoverId, setHoverId] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // If user scrolls mostly vertically, let the page handle it
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault(); // prevent page scroll
                container.scrollLeft += e.deltaY; // scroll horizontally instead
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, []);



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
            ref={scrollRef}
            className='flex flex-row overflow-x-auto space-x-4 p-4 scrollbar-hide rounded-xl hide-scrollbar  Z-100'
            
            onMouseDown={(e) => {
                setIsDragging(true);
                setStartX(e.pageX - e.currentTarget.offsetLeft);
                setScrollLeft(e.currentTarget.scrollLeft);
            }}
            onMouseLeave={() => setIsDragging(false)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={(e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - e.currentTarget.offsetLeft;
                const walk = (x - startX) * 2;
                e.currentTarget.scrollLeft = scrollLeft - walk;
            }}
        >
            {
                gamesList?.map((game, index) => {
                    const imgUrl = game.cover?.url
                        ? `https:${game.cover.url.replace("t_thumb", "t_screenshot_med")}`
                        : "/placeholder.jpg";
                    let xboxCount = 0;
                    let playStationCount = 0;
                    return (
                        <div onMouseEnter={() => { setHoverId(game.id) }} onMouseLeave={() => { setHoverId(0) }} key={game.id} className='flex flex-col min-w-[335px] overflow-hidden shadow-lg shrink-0 rounded-xl hover:scale-105 duration-300 ease-in-out'>
                            <div>
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
                                    <img className='w-full h-[188px] ' src={`${imgUrl}`} alt="" />
                                }



                            </div>

                            <div className='bg-[#202020] p-2 gap-2 flex flex-col rounded-b-xl '>
                                <div className='flex flex-row justify-between'>
                                    <div className='flex flex-row gap-2 '>
                                        {
                                            game?.platforms?.map((platform) => {
                                                let platformLogo = `https:${platform?.platform_logo?.url}`;

                                                if (platform.id === 6) {
                                                    platformLogo = 'https://img.icons8.com/?size=100&id=38805&format=png&color=FFFFFF'
                                                } else if (platform.id === 130) {
                                                    platformLogo = 'https://img.icons8.com/?size=100&id=XaIQdSh4y3F9&format=png&color=FFFFFF'
                                                } else if ((platform.id === 9 || platform.id === 48 || platform.id === 167) && playStationCount === 0) {
                                                    platformLogo = 'https://img.icons8.com/?size=100&id=12519&format=png&color=FFFFFF'
                                                    playStationCount++;
                                                } else if ((platform.id === 49 || platform.id === 169 || platform.id === 12) && xboxCount === 0) {
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

export default GamesList