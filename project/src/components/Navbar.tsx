//'use client'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { BiTrendingUp, BiUser } from 'react-icons/bi';
import { CgCommunity } from 'react-icons/cg';
import { LuGamepad2, LuLibrary } from 'react-icons/lu';
//import { usePathname } from 'next/navigation';
import SearchGames from './SearchGames';
import UserMenu from './UserMenu';
import MobileMenuButton from './MobileMenuButton';



const Navbar = () => {
    // const pathName = usePathname();
    // const isValid = pathName.startsWith('/login');





    // if (isValid) {
    //     return <></>;
    // }


    return (
        <>
            <div className='flex flex-row p-4 md:border-b border-gray-600 shadow-2xl gap-4 items-center justify-around'>
                <div className='flex flex-row items-center gap-2'>
                    <LuGamepad2 className='text-2xl text-purple-500' />
                    <Link href={'/'}>
                        <h1 className='bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-2xl'>
                            Gamely
                        </h1>
                    </Link>
                </div>

                <div className='md:flex hidden flex-row gap-8'>
                    <div className='flex gap-1 items-center text-gray-400 text-base font-medium hover:text-white ease-in-out duration-300'>
                        <LuLibrary className="text-2xl cursor-pointer" />
                        <Link href={'/library'}>
                            <p>Library</p>
                        </Link>
                    </div>

                    <div className='flex gap-1 items-center text-gray-400 text-base font-medium hover:text-white ease-in-out duration-300'>
                        <BiTrendingUp className="text-2xl cursor-pointer" />
                        <Link href={'/trending'}>
                            <p>Trending</p>
                        </Link>
                    </div>

                    <div className='flex gap-1 items-center text-gray-400 text-base font-medium hover:text-white ease-in-out duration-300'>
                        <CgCommunity className="text-2xl cursor-pointer" />
                        <Link href='/community'>
                            <p>Community</p>
                        </Link>
                    </div>
                </div>

                <div className='flex items-center gap-4 relative'>
                    <SearchGames />
                    <UserMenu />
                </div>

                <MobileMenuButton />
            </div>
        </>
    )
}

export default Navbar