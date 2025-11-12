'use client'
import React, { useState } from 'react'
import { BiBarChart, BiCrown, BiLogoWindows, BiMobile, BiSkipNext, BiSolidFlame, BiStar, BiTrophy, BiWindows } from 'react-icons/bi'
import { BsAndroid, BsNintendoSwitch, BsPlaystation, BsXbox } from 'react-icons/bs';

interface SideBarProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    onGenreChange: (id: number) => void;
    onPlatformChange: (id: number) => void
    platformId:number
}

export default function SideBar({ selectedCategory, onCategoryChange, onGenreChange, onPlatformChange , platformId}: SideBarProps) {

    return (
        <div className=' flex flex-col gap-4  p-4 pt-10'>
            {/* <div>
                <span className='text-3xl font-medium'>Home</span>
            </div> */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl'>New Releases</h1>
                <button
                    onClick={() => { onCategoryChange('last30days') }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${selectedCategory === 'last30days' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BiStar className={`${selectedCategory === 'last30days' && 'text-black'}`} size={20} />
                    </div>
                    <p>Last 30 days</p>
                </button>
                <button
                    onClick={() => { onCategoryChange('thisweek') }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${selectedCategory === 'thisweek' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BiSolidFlame className={`${selectedCategory === 'thisweek' && 'text-black'}`} size={20} />
                    </div>
                    <p>This week</p>
                </button>
                <button
                    onClick={() => { onCategoryChange('nextweek') }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${selectedCategory === 'nextweek' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>

                        <BiSkipNext className={`${selectedCategory === 'nextweek' && 'text-black'}`} size={20} />
                    </div>
                    <p>Next week</p>
                </button>
            </div>
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl'>Top</h1>
                <button
                    onClick={() => { onCategoryChange('bestofyear') }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${selectedCategory === 'bestofyear' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BiTrophy className={`${selectedCategory === 'bestofyear' && 'text-black'}`} size={20} />
                    </div>
                    <p className="text-white group-hover:text-white">Best of year</p>
                </button>

                <button
                    onClick={() => { onCategoryChange('popular2024') }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${selectedCategory === 'popular2024' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BiBarChart className={`${selectedCategory === 'popular2024' && 'text-black'}`} size={20} />

                    </div>
                    <p>Polpular in 2024</p>
                </button>
                <button
                    onClick={() => { onCategoryChange('top250') }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${selectedCategory === 'top250' && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BiCrown className={`${selectedCategory === 'top250' && 'text-black'}`} size={20} />

                    </div>
                    <p>Top 250</p>
                </button>
            </div>


            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl'>Genres</h1>
                {/* <button
                    onClick={() => { onGenreChange(13) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/w400/wp1879142.jpg" alt="" />
                    <p className="text-white group-hover:text-white">Action</p>
                </button> */}

                <button
                    onClick={() => { onGenreChange(5) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/w400/wp12288391.jpg" alt="" />

                    <p>Shooter</p>
                </button>
                <button
                    onClick={() => { onGenreChange(12) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/w400/wp13554867.jpg" alt="" />

                    <p>Role-playing</p>
                </button>
                <button
                    onClick={() => { onGenreChange(31) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/w400/wp14860452.webp" alt="" />

                    <p>Adventure</p>

                </button>
                <button
                    onClick={() => { onGenreChange(10) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/fuwp-510/uwp4281937.jpeg" alt="" />

                    <p>Racing</p>

                </button>
                <button
                    onClick={() => { onGenreChange(13) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/wpr/wp15742887.jpg" alt="" />

                    <p>Simulator</p>

                </button>
                <button
                    onClick={() => { onGenreChange(32) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/w400/wp2966135.png" alt="" />

                    <p>Indie</p>

                </button>
                <button
                    onClick={() => { onGenreChange(33) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/w400/wp10403504.jpg" alt="" />

                    <p>Arcade</p>

                </button>
                <button
                    onClick={() => { onGenreChange(9) }}
                    className="flex flex-row items-center gap-2 group">
                    <img className='w-8 h-8 object-cover rounded-md' src="https://wallpapercave.com/w400/wp4761185.jpg" alt="" />

                    <p>Puzzle</p>

                </button>

            </div>



            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl'>Platforms</h1>
                <button
                    onClick={() => { onPlatformChange(6) }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${platformId === 6 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BiLogoWindows className={`${platformId === 6 && 'text-black'}`} size={20} />

                    </div>
                    <p>PC</p>

                </button>
                <button
                    onClick={() => { onPlatformChange(48) }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${platformId === 48 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BsPlaystation className={`${platformId === 48 && 'text-black'}`} size={20} />

                    </div>
                    <p>Play Station</p>

                </button>
                <button
                    onClick={() => { onPlatformChange(169) }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${platformId === 169 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BsXbox className={`${platformId === 169 && 'text-black'}`} size={20} />

                    </div>
                    <p>Xbox</p>

                </button>
                <button
                    onClick={() => { onPlatformChange(508) }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${platformId === 508 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BsNintendoSwitch className={`${platformId === 508 && 'text-black'}`} size={20} />

                    </div>
                    <p>Nitendo</p>

                </button>
                <button
                    onClick={() => { onPlatformChange(34) }}
                    className="flex flex-row items-center gap-2 group">
                    <div className={`${platformId === 34 && 'text-black bg-white'} bg-[#202020] p-1.5 rounded-md text-white group-hover:bg-white group-hover:text-black transition-colors duration-200`}>
                        <BiMobile className={`${platformId === 34 && 'text-black'}`} size={20} />

                    </div>
                    <p>Mobile</p>

                </button>
            </div>
            <div>

            </div>
        </div>
    )
}

