'use client'
import axios from 'axios';
import { Search, User, FileText, X, Loader2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link'


interface User {
    id: string,
    name: string,
    username: string,
    profilePicture: string,
    avatar: string
}

interface Post {
    id: string,
    description: string,
    createdAt: Date,
}

const SearchCommunity = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'people'>('all');
    const searchBarDropDownRef = useRef<HTMLDivElement>(null);
    const [peopleResult, setPeopleResult] = useState<User[]>([]);
    const [postResult, setPostResult] = useState<Post[]>([]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchBarDropDownRef.current && !searchBarDropDownRef.current.contains(e.target as Node)) {
                setQuery('');
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setLoading(true);
        const handler = setTimeout(() => {
            setDebouncedQuery(query)
        }, 200);

        return () => {
            clearTimeout(handler)
        }
    }, [query])

    const getResults = async () => {
        if (!debouncedQuery.trim()) {
            setPeopleResult([]);
            setPostResult([]);
            setLoading(false);
            setIsOpen(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios({
                url: `/api/community-search`,
                method: 'post',
                data: {
                    query: debouncedQuery
                }
            });

            setPeopleResult(response.data.users || []);
            setPostResult(response.data.posts || []);
            setIsOpen(true);
        } catch (error) {
            console.error('Search error:', error);
            setPeopleResult([]);
            setPostResult([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getResults();
    }, [debouncedQuery])

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
        setPeopleResult([]);
        setPostResult([]);
    }

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    }


    const renderResults = () => {
        if (loading) {
            return (
                <div className="px-4 py-8 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-400" />
                    <div className="text-gray-400 text-sm mt-2">Searching...</div>
                </div>
            );
        }

        const hasResults = peopleResult.length > 0 || postResult.length > 0;

        if (!hasResults) {
            return (
                <div className="px-4 py-8 text-center text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <div className="font-medium">No results found</div>
                    <div className="text-sm mt-1">Try searching for something else</div>
                </div>
            );
        }

        if (activeTab === 'all') {
            return (
                <>
                    {
                        peopleResult.length > 0 && (
                            <div className="mb-4">
                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">People</div>
                                {peopleResult.slice(0, 3).map(person => (
                                    <Link href={`/player-profile/${person.id}`} key={person.id}>
                                        <div
                                            key={person.id}
                                            className={` px-4 py-3 hover:bg-white/50 cursor-pointer transition-colors flex items-center gap-3 rounded-full`}
                                        >
                                            {
                                                person.avatar ?
                                                    <>
                                                        <img
                                                            src={person.avatar}
                                                            alt={person.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    </>
                                                    :
                                                    <h1 className='text-2xl text-center  rounded-full'>{person?.username[0].toUpperCase()}</h1>


                                            }

                                            <div className="flex-1">
                                                <div className="font-semibold text-white">{person.name}</div>
                                                <div className="text-sm text-gray-400">@{person.username}</div>
                                            </div>
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </Link>


                                ))}
                            </div>
                        )
                    }
                    {postResult.length > 0 && (
                        <div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Posts</div>
                            {postResult.slice(0, 3).map(post => (
                                <Link href={`/community/post_details/${post.id}`} key={post.id}>
                                    <div
                                        key={post.id}
                                        className="px-4 py-3 hover:bg-white/50 cursor-pointer transition-colors"

                                    >
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm text-white mb-1 line-clamp-2">{post.description}</div>
                                                <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>


                            ))}
                        </div>
                    )}
                </>
            );
        } else if (activeTab === 'posts') {
            return postResult.length > 0 ? (
                postResult.map(post => (
                    <Link href={`/community/post_details/${post.id}`} key={post.id}>
                        <div
                            key={post.id}
                            className="px-4 py-3 hover:bg-white/50 cursor-pointer transition-colors"

                        >
                            <div className="flex items-start gap-3">
                                <FileText className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-white mb-1 line-clamp-2">{post.description}</div>
                                    <div className="text-xs text-gray-400">{formatDate(post.createdAt)}</div>
                                </div>
                            </div>
                        </div>
                    </Link>


                ))
            ) : (
                <div className="px-4 py-8 text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <div className="font-medium">No posts found</div>
                </div>
            );
        } else {
            return peopleResult.length > 0 ? (
                peopleResult.map(person => (
                    <Link href={`/player-profile/${person.id}`} key={person.id}>
                        <div
                            className="px-4 py-3 hover:bg-white/50 cursor-pointer transition-colors flex items-center gap-3"

                        >
                            {
                                person.avatar ?
                                    <>
                                        <img
                                            src={person.avatar}
                                            alt={person.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    </>
                                    :
                                    <h1 className='text-2xl text-center  rounded-full'>{person?.username[0].toUpperCase()}</h1>


                            }
                            <div className="flex-1">
                                <div className="font-semibold text-white">{person.name}</div>
                                <div className="text-sm text-gray-400">@{person.username}</div>
                            </div>
                            <User className="w-4 h-4 text-gray-400" />
                        </div>
                    </Link>


                ))
            ) : (
                <div className="px-4 py-8 text-center text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <div className="font-medium">No people found</div>
                </div>
            );
        }
    }

    return (
        <div ref={searchBarDropDownRef} className="relative w-full max-w-md">
            <div className="relative flex items-center flex-row ">
                <Search className="h-5 w-5 absolute left-2" />
                <input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value) }}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    className='w-full flex items-center rounded-lg bg-white/10 pl-10 pr-10 py-2 transition hover:bg-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-gray-400 placeholder:sm:text-md text-xs' placeholder='Search for posts, people...'
                    type="text"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1625] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10 bg-[#1a1625] sticky top-0 z-10">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'all'
                                ? 'text-purple-400 border-b-2 border-purple-400'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            All Results
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'posts'
                                ? 'text-purple-400 border-b-2 border-purple-400'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Posts ({postResult.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('people')}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'people'
                                ? 'text-purple-400 border-b-2 border-purple-400'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            People ({peopleResult.length})
                        </button>
                    </div>

                    {/* Results */}
                    <div className="py-2">
                        {renderResults()}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchCommunity