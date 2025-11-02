'use client'
import React, { useState } from 'react'
import { BiBarChart, BiCrown, BiSkipNext, BiSolidFlame, BiStar, BiTrophy } from 'react-icons/bi'

interface SideBarProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    onGenreChange: (id: number) => void;
}

export default function SideBar({ selectedCategory, onCategoryChange, onGenreChange }: SideBarProps) {

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
            <div>

            </div>
            <div>

            </div>
        </div>
    )
}

