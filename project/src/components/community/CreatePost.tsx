'use client'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { Image, Video, FileText, Cross } from 'lucide-react';
import { Game } from '@/app/types/game';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import { getYearFromUnix } from '@/app/utils/date';
import { ClipLoader, RotateLoader } from 'react-spinners';
import { GrClose } from 'react-icons/gr';
import { Post } from '@/app/types/post';
import { useRouter } from 'next/navigation'
import ShareAsPost from '../ShareAsPost';
import { redis } from '@/lib/redis';
import { useLoginModal } from '@/context/LoginModalContext';
import { useUser } from '@/context/UserContext';

interface Props {
    setShowPostModal: React.Dispatch<SetStateAction<boolean>>
    setPosts?: React.Dispatch<SetStateAction<Post[]>>
    groupId?: string
}

const CreatePostModal: React.FC<Props> = ({ setShowPostModal, setPosts, groupId }) => {
    const router = useRouter();

    const [postContent, setPostContent] = useState('');
    const [category, setCategory] = useState('GENERAL');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const searcBarDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [visibility, setVisibility] = useState(false);
    const CLOUDINARY_CLOUD_NAME = "diwmvqto3";
    const CLOUDINARY_UPLOAD_PRESET = "crowd-app";
    const { openLoginModal } = useLoginModal();
    const { isLoggedIn } = useUser();

    


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

    const selectedGameData = async (id: number) => {
        const response = await axios({
            url: `/api/private/gamedetails`,
            method: 'post',
            data: {
                id
            }
        })

        setSelectedGame(response.data.game);
    }



    const uploadToCloudinary = async (file: File, type: 'image' | 'video') => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET!);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!res.ok) {
                const text = await res.text();
                console.error('Cloudinary error response:', text);
                throw new Error('Upload failed');
            }

            const data = await res.json();
            return data.secure_url;
        } catch (err) {
            console.error('Cloudinary upload error:', err);
            throw err;
        }
    };

    const handleCreatePost = async () => {
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        setUploading(true)

        const extractHashtags = (text: string): string[] => {
            const matches = text.match(/#\w+/g);
            return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
        };

        const hashtags = extractHashtags(postContent);

        let uploadedUrls: string[] = [];

        if (images.length > 0) {
            const uploadPromises = images.map((file) => uploadToCloudinary(file, 'image'));
            uploadedUrls = await Promise.all(uploadPromises); // wait for all uploads
        }

        const response = await axios({
            url: `/api/private/createpost`,
            method: 'post',
            data: {
                description: postContent,
                name: selectedGame?.name,
                igdb_id: selectedGame?.id,
                summary: selectedGame?.summary,
                storyline: selectedGame?.storyline,
                first_release_date: selectedGame?.first_release_date,
                total_rating: selectedGame?.total_rating,
                cover: selectedGame?.cover,
                game_type: selectedGame?.game_type.type,
                genres: selectedGame?.genres,
                platforms: selectedGame?.platforms,
                type: category,
                tags: hashtags,
                mediaUrls: uploadedUrls,
                visibility: !groupId ? visibility ? 'EVERYONE' : 'ONLY_FOLLOWERS' : 'GROUP',
                groupId
            }
        });


        await redis.del('top-tags');

        if (setPosts) {
            setPosts(prev => [...prev, response.data.post]);
        }

        router.refresh();

        setTimeout(() => {
            setUploading(false);
            setShowPostModal(false);
        }, 500);

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setImages((prev) => [...prev, ...files]);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    }

    const handleRemoveImage = async (index: number) => {
        const newImages = [...images];
        const newPreviews = [...previews];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setPreviews(newPreviews);
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm h-screen w-screen overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900 to-purple-900 p-8">
                <h2 className="mb-6 text-2xl font-bold">Create a Post</h2>

                <div className="mb-4">
                    <label className="mb-2 block text-sm text-gray-400">Select One</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-purple-500/20 bg-white/10 px-4 py-3 outline-none transition focus:border-purple-500/60"
                    >
                        <option value="GENERAL" className="bg-gray-900">GENERAL</option>
                        <option value="QUERY" className="bg-gray-900">QUERY</option>
                        <option value="REVIEW" className="bg-gray-900">REVIEW</option>
                        <option value="SCREENSHOT" className="bg-gray-900">SCREENSHOT / IMAGES / VISUALS</option>
                        <option value="NEWS" className="bg-gray-900">NEWS</option>
                        <option value="GUIDE" className="bg-gray-900">GUIDE</option>
                        <option value="HELP" className="bg-gray-900">HELP</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="mb-2 block text-sm text-gray-400">What&apos;s on your mind?</label>
                    <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Share your gaming achievements, tips, or just chat with the community..."
                        className="h-40 w-full resize-none rounded-xl border border-purple-500/20 bg-white/10 px-4 py-3 outline-none transition focus:border-purple-500/60 placeholder:text-gray-400"
                    />
                </div>
                <div className='mb-6'>
                    <label className="mb-2 block text-sm text-gray-400">Select Images</label>

                    <label className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-md self-start hover:bg-gray-700">
                        Add Images
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                    {/* image previews */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-3 mt-4">
                            {previews.map((src, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={src}
                                        alt={`preview-${index}`}
                                        className="w-full h-32 object-cover rounded-md border border-gray-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {
                    selectedGame ?
                        <div className='flex flex-row gap-4 border border-gray-400 p-2 items-center justify-between w-fit mb-4'>
                            <div className='flex-row flex gap-2'>
                                <img
                                    src={selectedGame?.cover.url.replace('t_thumb', 't_cover_big')}
                                    alt={selectedGame?.name}
                                    className="w-16 h-16 rounded-md object-cover"
                                />
                                <div className='flex flex-col gap-2'>
                                    <span>{selectedGame.name}</span>
                                    <span>{getYearFromUnix(selectedGame.first_release_date)}</span>
                                </div>
                            </div>
                            <button onClick={() => { setSelectedGame(null) }}>
                                <GrClose size={20} />
                            </button>
                        </div>
                        :
                        <div className="mb-6">
                            <label className="mb-2 block text-sm text-gray-400">Add game</label>
                            <div ref={searcBarDropdownRef} className='flex  items-center gap-4 relative'>
                                <input value={query} onChange={(e) => { setQuery(e.target.value) }} className='p-2 hover:outline-purple-600 transition-all ease-in-out duration-300 hover:outline-1 outline-0 rounded-full border border-gray-400 hover:border-0 text-sm px-8 shadow-2xl text-gray-300 bg-[#3B3B3B] placeholder:font-medium placeholder:text-sm w-44 sm:w-full' placeholder='Search for games' type="text" />
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
                                                        selectedGameData(game.id)
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
                        </div>
                }
                {
                    !groupId &&
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="username" className="text-white text-base font-medium mb-2">Share</label>
                        <div className='flex flex-row justify-between items-center w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 px-4 text-base '>
                            <span className=''>{visibility ? 'Share to everyone' : 'Share only to followers'}</span>
                            <div
                                onClick={() => { setVisibility(prev => !prev) }}
                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition 
                         ${visibility ? "bg-purple-600" : "bg-gray-400"}`}
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition 
                        ${visibility ? "translate-x-6" : ""}`}
                                >

                                </div>

                            </div>

                        </div>
                    </div>
                }






                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowPostModal(false)}
                        className="flex-1 rounded-xl bg-white/10 py-3 font-semibold transition hover:bg-white/20"
                    >
                        Cancel
                    </button>
                    <div
                        className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold transition hover:from-purple-700 hover:to-pink-700 items-center justify-center flex"
                    >
                        {
                            uploading ?
                                <div className='self-center'>
                                    <ClipLoader size={30} color='white' />
                                </div>
                                :
                                <button
                                    onClick={handleCreatePost}
                                >
                                    Post
                                </button>
                        }
                    </div>


                </div>
            </div>

        </div>
    )
}

export default CreatePostModal