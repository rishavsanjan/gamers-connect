'use client'

import React, { SetStateAction, useState } from 'react'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { GrClose } from 'react-icons/gr'
import { IoCreate } from 'react-icons/io5'
import { RiImageAddFill } from 'react-icons/ri'

import { Game } from '@/app/types/game'
import { Post } from '@/app/types/post'
import { getYearFromUnix } from '@/app/utils/date'
import { useLoginModal } from '@/context/LoginModalContext'
import { useUser } from '@/context/UserContext'
import { useGroupPostsStore } from '@/zustland/groupPostsStore'
import { usePostFeedStore } from '@/zustland/postFeedStore'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

import SearchGames from '../SearchGames'

interface Props {
    setShowPostModal: React.Dispatch<SetStateAction<boolean>>
    groupId?: string
}

const CreatePostModal: React.FC<Props> = ({ setShowPostModal, groupId }) => {
    const [postContent, setPostContent] = useState('')
    const [category, setCategory] = useState('GENERAL')
    const [selectedGame, setSelectedGame] = useState<Game | null>(null)
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [visibility, setVisibility] = useState('EVERYONE')

    const CLOUDINARY_CLOUD_NAME = 'diwmvqto3'
    const CLOUDINARY_UPLOAD_PRESET = 'crowd-app'

    const { openLoginModal } = useLoginModal()
    const { isLoggedIn } = useUser()

    const setHomeFeedPosts = usePostFeedStore((s) => s.setPosts)
    const setGroupPosts = useGroupPostsStore((s) => s.setPosts)
    const homePosts = usePostFeedStore((s) => s.posts)
    const groupPosts = useGroupPostsStore((s) => s.posts)

    const selectedGameData = async (id: number) => {
        const response = await axios.post('/api/private/gamedetails', { id })
        setSelectedGame(response.data.game)
    }

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: formData }
        )

        const data = await res.json()
        return data.secure_url
    }

    const handleCreatePost = async () => {
        if (!isLoggedIn) {
            openLoginModal()
            return
        }

        setUploading(true)

        const hashtags =
            postContent.match(/#\w+/g)?.map((t) => t.slice(1).toLowerCase()) ?? []

        const uploadedUrls =
            images.length > 0
                ? await Promise.all(images.map(uploadToCloudinary))
                : []

        const response = await axios.post('/api/private/createpost', {
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
            visibility: !groupId
                ? visibility === 'EVERYONE'
                    ? 'EVERYONE'
                    : 'ONLY_FOLLOWERS'
                : 'GROUP',
            groupId,
        })

        if (!groupId) {
            setHomeFeedPosts([response.data.formattedPost, ...homePosts])
        } else {
            setGroupPosts([response.data.formattedPost, ...groupPosts])
        }

        setUploading(false)
        setShowPostModal(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        setImages((prev) => [...prev, ...files])
        setPreviews((prev) => [...prev, ...files.map(URL.createObjectURL)])
    }

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <Dialog open onOpenChange={setShowPostModal}>
            <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-purple-900 border border-purple-500/30">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IoCreate className="text-pink-500" />
                        Create a Post
                    </DialogTitle>
                </DialogHeader>

                {/* CATEGORY */}
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


                {/* TEXT */}

                <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="h-32 w-full rounded-xl bg-white/10 p-3"
                    placeholder="What's on your mind?"
                />

                {/* IMAGES */}
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

                {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                        {previews.map((src, i) => (
                            <div key={i} className="relative">
                                <img src={src} className="h-24 w-full object-cover rounded" />
                                <button
                                    onClick={() => handleRemoveImage(i)}
                                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-2"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* GAME */}
                {selectedGame ? (
                    <div className="flex items-center gap-3">
                        <img
                            src={selectedGame.cover.url.replace('t_thumb', 't_cover_big')}
                            className="h-14 w-14 rounded"
                        />
                        <div>
                            <p>{selectedGame.name}</p>
                            <p className="text-sm opacity-70">
                                {getYearFromUnix(selectedGame.first_release_date)}
                            </p>
                        </div>
                        <button onClick={() => setSelectedGame(null)}>
                            <GrClose />
                        </button>
                    </div>
                ) : (
                    <SearchGames selectedGameData={selectedGameData} />
                )}

                {/* VISIBILITY */}
                {!groupId && (
                    <Select value={visibility} onValueChange={setVisibility}>
                        <SelectTrigger>
                            <SelectValue placeholder="Share to everyone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="EVERYONE">Everyone</SelectItem>
                            <SelectItem value="FOLLOWERS">Followers</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                {/* ACTIONS */}
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowPostModal(false)}
                        className="flex-1 rounded-xl bg-white/10 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={uploading || !postContent.trim()}
                        onClick={handleCreatePost}
                        className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-2"
                    >
                        {uploading ? <ClipLoader size={20} color="white" /> : 'Post'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePostModal
