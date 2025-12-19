import { Eye, Globe, Image, SmilePlus, UserPlus } from 'lucide-react'
import React from 'react'

interface Props {
    groupName: string,
    selectedPrivacy: string,
    selectedVisibility: string
    description: string
}

const GroupPreview: React.FC<Props> = ({ groupName, selectedPrivacy, selectedVisibility, description }) => {
    return (
        <div className='lg:w-[75%]'>
            <div className="min-h-screen bg-gray-900 text-white sm:p-6 p-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Preview</h2>
                </div>

                {/* Preview Card */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    {/* Cover Image */}
                    <div className="w-full h-64 bg-gray-600 relative">
                        <img
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300'%3E%3Crect fill='%23e0e0e0' width='800' height='300'/%3E%3Cg fill='%23999'%3E%3Ccircle cx='200' cy='150' r='80'/%3E%3Ccircle cx='600' cy='150' r='80'/%3E%3Crect x='100' y='200' width='600' height='100' rx='10'/%3E%3C/g%3E%3C/svg%3E"
                            alt="Group cover"
                            className="w-full h-full object-cover opacity-40"
                        />
                    </div>

                    {/* Group Info Section */}
                    <div className="p-6 cursor-not-allowed">
                        <h1 className="text-2xl font-bold text-gray-400 mb-2">{groupName.trim().length > 0 ? groupName : ' Group name'}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                            <Globe size={16} />
                            <span>Public group · 1 member</span>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex gap-6 border-b border-gray-700 mb-6">
                            <button className="pb-3 border-b-2 border-blue-500 text-white font-semibold">
                                About
                            </button>

                            <button className="pb-3 text-gray-400">
                                Posts
                            </button>
                            <button className="pb-3 text-gray-400">
                                Members
                            </button>
                            <button className="pb-3 text-gray-400">
                                Media
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex lg:flex-row flex-col gap-6 cursor-not-allowed">
                            {/* Left Column - Post Creator */}
                            <div className="flex-1">
                                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="What's on your mind?"
                                            className="flex-1 bg-transparent text-gray-400 outline-none"
                                            disabled
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-600">
                                        <button className="flex items-center gap-2 text-gray-400 sm:px-4 sm:py-2 rounded-lg">
                                            <Image size={20} />
                                            <span className="text-sm">Media</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-400 sm:px-4 sm:py-2 rounded-lg">
                                            <UserPlus size={20} />
                                            <span className="text-sm">People</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-gray-400 sm:px-4 sm:py-2 rounded-lg">
                                            <SmilePlus size={20} />
                                            <span className="text-sm">Feeling/activity</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - About Section */}
                            <div className="lg:w-80 w-full">
                                <div className="bg-gray-700 rounded-lg p-4">
                                    <div className='flex flex-col shrink-0'>
                                        <h3 className="text-lg font-semibold ">About</h3>
                                        <p className="text-sm text-[#b0b3b8] mb-2 line-clamp-4 break-words">
                                            {description.trim().length === 0 ? 'No Description!' : description}
                                        </p>

                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <Globe size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="font-semibold mb-1"> {selectedPrivacy === 'Public' ? 'Public' : 'Private'}</p>
                                                <p className="text-sm text-gray-400">
                                                    {selectedPrivacy === 'Public' ? "Anyone can see who's in the group and what they post." : 'Only those who joined can see the posts.'}

                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Eye size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="font-semibold mb-1">{selectedVisibility === 'Visible' ? 'Visible' : 'Hidden'}</p>
                                                <p className="text-sm text-gray-400">
                                                    {selectedVisibility === 'Visible' ? 'Anyone can find this group.' : 'Only people with invite link can find this.'}

                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupPreview