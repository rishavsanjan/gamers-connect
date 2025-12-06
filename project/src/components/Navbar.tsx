'use client'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { BiSearch, BiTrendingUp, BiUser } from 'react-icons/bi';
import { CgCommunity } from 'react-icons/cg';
import { LuGamepad2, LuLibrary } from 'react-icons/lu';
import { Game } from '@/app/types/game';
import axios from 'axios';
import { getYearFromUnix } from '@/app/utils/date';
import { RotateLoader } from 'react-spinners';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useUser } from '@/context/UserContext';
import { LoginModal } from './NotLogged';
import { createPortal } from 'react-dom';



const Navbar = () => {
    const { setUser, user, isLoggedIn } = useUser();
    console.log(isLoggedIn, user)
    const pathName = usePathname();
    const isValid = pathName.startsWith('/login');
    const [loginModal, setLoginModal] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const searcBarDropdownRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searcBarDropdownRef.current && !searcBarDropdownRef.current.contains(e.target as Node)) {
                setQuery('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [])

    useEffect(() => {
        setLoading(true)
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);

        return () => {
            clearTimeout(handler)
        }
    }, [query])


    useEffect(() => {
        const fetchGames = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                return;
            }

            const response = await axios({
                url: '/api/search_game',
                params: {
                    query: debouncedQuery
                },
                method: 'POST'
            })
            console.log(response.data)
            setResults(response.data);
            setLoading(false)
        }

        fetchGames();
    }, [debouncedQuery]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);


    if (isValid) {
        return <></>;
    }


    return (
        <>
            <div className='flex flex-row  p-4 md:border-b  border-gray-600 shadow-2xl gap-4 items-center justify-around'>
                <div className='flex flex-row items-center gap-2  '>
                    <LuGamepad2 className='text-2xl text-purple-500' />
                    <Link href={'/'}>
                        <h1 className='bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-2xl'>Gamely</h1>
                    </Link>

                </div>
                <div className='md:flex hidden flex-row gap-8'>
                    <div className='flex gap-1 items-center text-gray-400 text-base font-medium'>
                        <LuLibrary className="text-2xl hover:text-blue-400 cursor-pointer" />
                        <Link href={'/library'}>
                            <p>Library</p>
                        </Link>

                    </div>
                    <div className='flex gap-1 items-center text-gray-400 text-base font-medium'>
                        <BiTrendingUp className="text-2xl hover:text-blue-400 cursor-pointer" />
                        <Link href={'/trending'}>
                            <p>Trending</p>
                        </Link>


                    </div>
                    <div className='flex gap-1 items-center text-gray-400 text-base font-medium'>
                        <CgCommunity className="text-2xl hover:text-blue-400 cursor-pointer" />
                        <Link href='/community'>
                            <p>Community</p>
                        </Link>

                    </div>
                </div>
                <div ref={searcBarDropdownRef} className='flex  items-center gap-4 relative'>
                    <input value={query} onChange={(e) => { setQuery(e.target.value) }} className='p-2 hover:outline-purple-600 transition-all ease-in-out duration-300 hover:outline-1 outline-0 rounded-full border border-gray-400 hover:border-0 text-sm px-8 shadow-2xl text-gray-300 bg-[#3B3B3B] placeholder:font-medium placeholder:text-sm  w-44 sm:w-full h-8' placeholder='Search for games' type="text" />
                    <BiSearch className='absolute left-2 text-gray-500' size={15} />
                    <div className="md:flex hidden relative">
                        {isLoggedIn ? (
                            <div className="relative group">
                                {/* Profile Icon */}
                                <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer bg-[#202020] flex items-center justify-center group-hover:bg-white transition-all duration-200">
                                    <BiUser className="text-2xl text-white group-hover:text-black transition-colors" />
                                </div>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-[#1f1f1f] text-white rounded-lg shadow-lg opacity-0 scale-95 transform transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 z-50">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 hover:bg-white hover:text-black rounded-t-lg"
                                    >
                                        My Profile
                                    </Link>

                                    <button
                                        onClick={async () => {
                                            await logout();
                                            setUser(null);
                                        }
                                        }
                                        className="w-full text-left px-4 py-2 hover:bg-white hover:text-black rounded-b-lg"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => { setLoginModal(true) }}>Login/Signup</button>
                        )}
                    </div>

                    {/* Results dropdown */}
                    {query.trim() && (
                        <div className="absolute top-full -left-16 md:left-0 right-0 mt-2 bg-gray-900 border  border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50 w-72 md:w-full">
                            {loading ? (
                                <div className='items-center flex justify-center self-center p-4 py-8'>
                                    <RotateLoader size={15} color='#ce45da' />
                                </div>

                            ) : results.length === 0 ? (
                                <p className="p-3 text-gray-400 text-sm">No games found.</p>
                            ) : (
                                <ul className="divide-y divide-gray-700">
                                    {results.map((game) => (
                                        <li
                                            key={game.id}
                                            className="flex items-center gap-4 p-3 hover:bg-gray-800 cursor-pointer transition"
                                            onClick={() => {
                                                window.location.href = `/details/${game.id}`;
                                            }}
                                        >
                                            {game.cover?.url && (
                                                <img
                                                    src={game.cover.url.replace('t_thumb', 't_cover_big')}
                                                    alt={game.name}
                                                    className="w-16 h-16 rounded-md object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-semibold text-white">{game.name}({getYearFromUnix(game.first_release_date)})</p>
                                                {game.genres && (
                                                    <p className="text-sm text-gray-400">
                                                        {game.genres.map(g => g.name).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className='md:hidden  flex justify-center'>
                    <button onClick={() => setIsMobileMenuOpen(true)}>
                        <AiOutlineMenu color='white' size={32} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Slider */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-[#1a1a1a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                        <AiOutlineClose color='white' size={28} />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col gap-6 px-6 py-4">
                    <Link
                        href="/library"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors"
                    >
                        <LuLibrary className="text-2xl" />
                        <span>Library</span>
                    </Link>

                    <Link
                        href="/trending"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors"
                    >
                        <BiTrendingUp className="text-2xl" />
                        <span>Trending</span>
                    </Link>

                    <Link
                        href="/community"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors"
                    >
                        <CgCommunity className="text-2xl" />
                        <span>Community</span>
                    </Link>

                    {/* Divider */}
                    <div className="border-t border-gray-700 my-2" />

                    {/* Profile Section */}
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-purple-500 transition-colors z-100"
                            >
                                <BiUser className="text-2xl" />
                                <span>My Profile</span>
                            </Link>

                            <button
                                onClick={async () => {
                                    await logout();
                                    setUser(null);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex gap-3 items-center text-gray-300 text-lg font-medium hover:text-red-500 transition-colors text-left"
                            >
                                <span className="text-2xl">⎋</span>
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (

                        <button
                            className='flex flex-row items-center gap-2'
                            onClick={() => {
                                setLoginModal(true)
                                setIsMobileMenuOpen(false)
                            }}>
                            <BiUser className="text-2xl" />

                            <span> Login/Signup</span>

                        </button>

                    )}
                </div>
            </div>
            {loginModal && typeof window !== 'undefined' && createPortal(
                <LoginModal isOpen={loginModal} setLoginModal={setLoginModal} />,
                document.body
            )}
        </>
    )
}

export default Navbar