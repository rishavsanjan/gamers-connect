'use client'
import React from 'react'
import { BiBarChart, BiCrown, BiLogoWindows, BiMobile, BiSkipNext, BiSolidFlame, BiStar, BiTrophy } from 'react-icons/bi'
import { BsNintendoSwitch, BsPlaystation, BsXbox } from 'react-icons/bs';

interface SideBarProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    onGenreChange: (id: number) => void;
    onPlatformChange: (id: number) => void
    platformId: number
}

export function SideBar({ selectedCategory, onCategoryChange, onGenreChange, onPlatformChange, platformId }: SideBarProps) {

    return (
        <div className='flex flex-col gap-4 p-4 pt-4 md:pt-10 overflow-x-auto md:overflow-y-auto hide-scrollbar'>
            {/* New Releases Section */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-xl md:text-2xl font-semibold'>New Releases</h1>
                <div className='flex md:flex-col flex-row gap-2 overflow-x-auto md:overflow-x-visible hide-scrollbar'>
                    <button
                        onClick={() => { onCategoryChange('last30days') }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${selectedCategory === 'last30days' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BiStar className={`${selectedCategory === 'last30days' && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>Last 30 days</p>
                    </button>
                    <button
                        onClick={() => { onCategoryChange('thisweek') }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${selectedCategory === 'thisweek' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BiSolidFlame className={`${selectedCategory === 'thisweek' && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>This week</p>
                    </button>
                    <button
                        onClick={() => { onCategoryChange('nextweek') }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${selectedCategory === 'nextweek' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BiSkipNext className={`${selectedCategory === 'nextweek' && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>Next week</p>
                    </button>
                </div>
            </div>

            {/* Top Section */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-xl md:text-2xl font-semibold'>Top</h1>
                <div className='flex md:flex-col flex-row gap-2 overflow-x-auto md:overflow-x-visible hide-scrollbar'>
                    <button
                        onClick={() => { onCategoryChange('bestofyear') }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${selectedCategory === 'bestofyear' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BiTrophy className={`${selectedCategory === 'bestofyear' && 'text-black'}`} size={20} />
                        </div>
                        <p className="text-white group-hover:text-white text-md md:text-base">Best of year</p>
                    </button>

                    <button
                        onClick={() => { onCategoryChange('popular2024') }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${selectedCategory === 'popular2024' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BiBarChart className={`${selectedCategory === 'popular2024' && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>Popular in 2024</p>
                    </button>
                    <button
                        onClick={() => { onCategoryChange('top250') }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${selectedCategory === 'top250' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BiCrown className={`${selectedCategory === 'top250' && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>Top 250</p>
                    </button>
                </div>
            </div>

            {/* Genres Section */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-xl md:text-2xl font-semibold'>Genres</h1>
                <div className='flex md:flex-col flex-row gap-2 overflow-x-auto md:overflow-x-visible hide-scrollbar pb-2'>
                    <button
                        onClick={() => { onGenreChange(5) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <img className='w-8 h-8 object-cover rounded-md flex-shrink-0' src="https://wallpapercave.com/w400/wp12288391.jpg" alt="" />
                        <p className='text-md md:text-base'>Shooter</p>
                    </button>
                    <button
                        onClick={() => { onGenreChange(12) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <img className='w-8 h-8 object-cover rounded-md flex-shrink-0' src="https://wallpapercave.com/w400/wp13554867.jpg" alt="" />
                        <p className='text-md md:text-base'>Role-playing</p>
                    </button>
                    <button
                        onClick={() => { onGenreChange(31) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <img className='w-8 h-8 object-cover rounded-md flex-shrink-0' src="https://wallpapercave.com/w400/wp14860452.webp" alt="" />
                        <p className='text-md md:text-base'>Adventure</p>
                    </button>
                    <button
                        onClick={() => { onGenreChange(10) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <img className='w-8 h-8 object-cover rounded-md flex-shrink-0' src="https://wallpapercave.com/fuwp-510/uwp4281937.jpeg" alt="" />
                        <p className='text-md md:text-base'>Racing</p>
                    </button>
                    <button
                        onClick={() => { onGenreChange(13) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <img className='w-8 h-8 object-cover rounded-md flex-shrink-0' src="https://wallpapercave.com/wpr/wp15742887.jpg" alt="" />
                        <p className='text-md md:text-base'>Simulator</p>
                    </button>
                    <button
                        onClick={() => { onGenreChange(32) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <img className='w-8 h-8 object-cover rounded-md flex-shrink-0' src="https://wallpapercave.com/w400/wp2966135.png" alt="" />
                        <p className='text-md md:text-base'>Indie</p>
                    </button>
                    <button
                        onClick={() => { onGenreChange(33) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <img className='w-8 h-8 object-cover rounded-md flex-shrink-0' src="https://wallpapercave.com/w400/wp10403504.jpg" alt="" />
                        <p className='text-md md:text-base'>Arcade</p>
                    </button>
                    <button
                        onClick={() => { onGenreChange(9) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <img className='w-8 h-8 object-cover rounded-md flex-shrink-0' src="https://wallpapercave.com/w400/wp4761185.jpg" alt="" />
                        <p className='text-md md:text-base'>Puzzle</p>
                    </button>
                </div>
            </div>

            {/* Platforms Section */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-xl md:text-2xl font-semibold'>Platforms</h1>
                <div className='flex md:flex-col flex-row gap-2 overflow-x-auto md:overflow-x-visible hide-scrollbar pb-2'>
                    <button
                        onClick={() => { onPlatformChange(6) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${platformId === 6 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BiLogoWindows className={`${platformId === 6 && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>PC</p>
                    </button>
                    <button
                        onClick={() => { onPlatformChange(48) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${platformId === 48 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BsPlaystation className={`${platformId === 48 && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>Play Station</p>
                    </button>
                    <button
                        onClick={() => { onPlatformChange(169) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${platformId === 169 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BsXbox className={`${platformId === 169 && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>Xbox</p>
                    </button>
                    <button
                        onClick={() => { onPlatformChange(508) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${platformId === 508 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BsNintendoSwitch className={`${platformId === 508 && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>Nintendo</p>
                    </button>
                    <button
                        onClick={() => { onPlatformChange(34) }}
                        className="flex flex-row items-center gap-2 group whitespace-nowrap">
                        <div className={`${platformId === 34 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                            <BiMobile className={`${platformId === 34 && 'text-black'}`} size={20} />
                        </div>
                        <p className='text-md md:text-base'>Mobile</p>
                    </button>
                </div>
            </div>
        </div>
    )
}