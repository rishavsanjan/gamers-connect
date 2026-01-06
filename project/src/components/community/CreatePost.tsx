'use client'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { Game } from '@/app/types/game';
import axios from 'axios';
import { getYearFromUnix } from '@/app/utils/date';
import { ClipLoader, RotateLoader } from 'react-spinners';
import { GrClose } from 'react-icons/gr';
import { Post } from '@/app/types/post';
import { redis } from '@/lib/redis';
import { useLoginModal } from '@/context/LoginModalContext';
import { useUser } from '@/context/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { IoCreate } from 'react-icons/io5';
import { RiImageAddFill } from 'react-icons/ri';
import SearchGames from '../SearchGames';
import { useGroupPostsStore } from '@/zustland/groupPostsStore';
import { usePostFeedStore } from '@/zustland/postFeedStore';

interface Props {
    setShowPostModal: React.Dispatch<SetStateAction<boolean>>
    setPosts?: React.Dispatch<SetStateAction<Post[]>>
    groupId?: string
}

const CreatePostModal: React.FC<Props> = ({ setShowPostModal, groupId }) => {

    const [postContent, setPostContent] = useState('');
    const [category, setCategory] = useState('GENERAL');

    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [visibility, setVisibility] = useState('EVERYONE');
    const CLOUDINARY_CLOUD_NAME = "diwmvqto3";
    const CLOUDINARY_UPLOAD_PRESET = "crowd-app";
    const { openLoginModal } = useLoginModal();
    const { isLoggedIn } = useUser();
    const modalRef = useRef(null);


    const setHomeFeedPosts = usePostFeedStore((s) => s.setPosts);
    const setGroupPosts = useGroupPostsStore((s) => s.setPosts);
    const homePosts = usePostFeedStore((s) => s.posts)
    const groupPosts = useGroupPostsStore((s) => s.posts);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            //@ts-ignore
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowPostModal(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowPostModal]);

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
            uploadedUrls = await Promise.all(uploadPromises);
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
                visibility: !groupId ? visibility === 'EVERYONE' ? 'EVERYONE' : 'ONLY_FOLLOWERS' : 'GROUP',
                groupId
            }
        });


        //await redis.del('top-tags');
        console.log(response.data.formattedPost);
        const newPost = response.data.formattedPost;
        if (!groupId) {
            setHomeFeedPosts([response.data.formattedPost, ...homePosts]);
        } else {
            setGroupPosts([response.data.formattedPost, ...groupPosts]);
        }

        //router.refresh();

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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm h-screen w-screen overflow-y-auto">
            <div ref={modalRef} className="w-full max-w-2xl rounded-4xl border border-purple-500/30 bg-gradient-to-br from-gray-900 to-purple-900           px-4  py-4 mx-2">
                <div className='flex flex-row items-center gap-1 mb-6'>
                    <IoCreate className='text-pink-500 w-6 h-6' />
                    <h2 className="text-2xl font-bold">Create a Post</h2>
                </div>



                <div className="flex flex-col  mb-4">

                    <label className="mb-2 block text-sm text-gray-400">Select One</label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="flex-1 bg-transparent w-full">
                            <SelectValue placeholder="GENERAL" />
                        </SelectTrigger>
                        <SelectContent>
                            {["GENERAL", "QUERY", "REVIEW", "SCREENSHOT", "NEWS", "GUIDE", "HELP"].map(item => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

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

                    <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-[#4C1D95]/50 hover:bg-gray-100 dark:hover:bg-[#5B21B6] hover:border-primary dark:hover:border-primary/50 text-gray-500 dark:text-white/60 transition-all group w-32 cursor-pointer">

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <RiImageAddFill />
                        <span className="text-[10px] font-medium uppercase tracking-wide">Add Image</span>

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
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
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
                            <button
                                className='cursor-pointer'
                                onClick={() => { setSelectedGame(null) }}
                            >
                                <GrClose size={20} />
                            </button>
                        </div>
                        :
                        <div className="mb-6">
                            <label className="mb-2 block text-sm text-gray-400">Add game</label>
                            <SearchGames selectedGameData={selectedGameData} />

                        </div>
                }
                {
                    !groupId &&
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="username" className="text-white text-base font-medium mb-2">Share</label>
                        <Select value={visibility} onValueChange={setVisibility}>
                            <SelectTrigger className="flex-1 bg-transparent w-full">
                                <SelectValue placeholder="Share to everyone" />
                            </SelectTrigger>
                            <SelectContent>
                                {["EVERYONE", "FOLLOWERS"].map(item => (
                                    <SelectItem key={item} value={item}>Share to {item.toLocaleLowerCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>
                }






                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowPostModal(false)}
                        className="flex-1 rounded-xl bg-white/10 py-3 font-semibold transition hover:bg-white/20 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={uploading || postContent.trim().length === 0}
                        onClick={handleCreatePost}
                        className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold transition hover:from-purple-700 hover:to-pink-700 items-center justify-center flex disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                    >
                        {
                            uploading ?
                                <ClipLoader size={30} color='white' />
                                :
                                <>
                                    Post
                                </>

                        }
                    </button>


                </div>
            </div>

        </div>
    )
}

export default CreatePostModal