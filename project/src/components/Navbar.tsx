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

const Navbar = () => {
    const pathName = usePathname();
    const isValid = pathName.startsWith('/login');
    if (isValid) {
        return null;
    }
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
    })

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
    }, [debouncedQuery])

    return (
        <div className='flex flex-row justify-around p-4 border-b-2  border-gray-600 shadow-2xl '>
            <div className='flex flex-row items-center gap-2  '>
                <LuGamepad2 className='text-2xl text-purple-500' />
                <Link href={'/'}>
                    <h1 className='bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-2xl'>Gamely</h1>
                </Link>

            </div>
            <div className='flex flex-row gap-8'>
                <div className='flex gap-1 items-center text-gray-400 text-base font-medium'>
                    <BiSearch className="text-2xl hover:text-blue-400 cursor-pointer" />
                    <p>Browse</p>
                </div>
                <div className='flex gap-1 items-center text-gray-400 text-base font-medium'>
                    <LuLibrary className="text-2xl hover:text-blue-400 cursor-pointer" />
                    <p>Library</p>
                </div>
                <div className='flex gap-1 items-center text-gray-400 text-base font-medium'>
                    <BiTrendingUp className="text-2xl hover:text-blue-400 cursor-pointer" />
                    <p>Trending</p>

                </div>
                <div className='flex gap-1 items-center text-gray-400 text-base font-medium'>
                    <CgCommunity className="text-2xl hover:text-blue-400 cursor-pointer" />
                    <p>Community</p>
                </div>
            </div>
            <div ref={searcBarDropdownRef} className='flex items-center gap-4 relative'>
                <input value={query} onChange={(e) => { setQuery(e.target.value) }} className='p-2 hover:outline-purple-600 transition-all ease-in-out duration-300 hover:outline-1 outline-0 rounded-xl border border-gray-400 hover:border-0 text-sm px-8 shadow-2xl text-gray-300' placeholder='Search games....' type="text" />
                <Link href={'/profile'}>
                    <button >
                        <BiUser className='text-2xl' />
                    </button>
                </Link>


                {/* Results dropdown */}
                {query.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border  border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
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
            <div>
                <button onClick={() => { logout() }} className='bg-pink-500'>Sign Out button</button>
            </div>
        </div>
    )
}

export default Navbar