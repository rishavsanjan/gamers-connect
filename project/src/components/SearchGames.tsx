'use client'
import { Game } from '@/app/types/game';
import { getYearFromUnix } from '@/app/utils/date';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { BiSearch } from 'react-icons/bi';
import { RotateLoader } from 'react-spinners';

interface Props {
    selectedGameData?: (id: number) => Promise<void>
}

const SearchGames: React.FC<Props> = ({ selectedGameData }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const searcBarDropdownRef = useRef<HTMLDivElement>(null);
    const [results, setResults] = useState<Game[]>([]);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

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
            setResults(response.data);
            setLoading(false)
        }

        fetchGames();
    }, [debouncedQuery]);


    return (
        <div ref={searcBarDropdownRef} className='flex  items-center gap-4 relative'>
            <input value={query} onChange={(e) => { setQuery(e.target.value) }} className='w-full flex items-center rounded-lg bg-white/10 pl-10 pr-10 py-2 transition hover:bg-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-gray-400 placeholder:sm:text-md text-xs'

                placeholder='Search for games' type="text" />
            <BiSearch className='absolute left-2 ' size={20} />


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
                                <button onClick={() => {
                                    setQuery('');
                                    selectedGameData ?
                                        selectedGameData(game.id)
                                        :
                                        window.location.href = `/details/${game.id}`;

                                }}>
                                    <li
                                        key={game.id}
                                        className="flex items-center gap-4 p-3 hover:bg-gray-800 cursor-pointer transition"

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
                                </button>


                            ))}
                        </ul>

                    )}
                </div>
            )}
        </div>
    )
}

export default SearchGames