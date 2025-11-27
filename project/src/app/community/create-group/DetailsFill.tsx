'use client'
import { Globe, Lock, X } from 'lucide-react';
import React, { useState } from 'react'

const DetailsFill = () => {
    const [invitedFriend, setInvitedFriend] = useState('Aditya Lalhal Aditya');
    const [inputValue, setInputValue] = useState('');
    const [groupName, setGroupName] = useState('');
    const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
    const [selectedPrivacy, setSelectedPrivacy] = useState('Public');
    const removeFriend = () => {
        setInvitedFriend('');
    };

    const selectPrivacy = (privacy: string) => {
        setSelectedPrivacy(privacy);
        setShowPrivacyMenu(false);
    };
    return (
        <>
            <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />

            {/* Privacy Selector */}
            <div className="mb-2 relative">
                <button
                    onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                    className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 flex items-center justify-between text-left hover:bg-gray-800"
                >
                    <div className="flex items-center gap-3">
                        <Globe size={24} className="text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">Choose privacy</p>
                            <p className="font-semibold">{selectedPrivacy}</p>
                        </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Privacy Dropdown Menu */}
                {showPrivacyMenu && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg p-4 z-10">
                        {/* Public Option */}
                        <div
                            onClick={() => selectPrivacy('Public')}
                            className="flex items-start gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer mb-3"
                        >
                            <Globe size={24} className="text-gray-400 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-semibold mb-1">Public</p>
                                <p className="text-sm text-gray-400">
                                    Anyone can see who's in the group and what they post.
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Depending on your group's size and age, you might be able to change to private later.
                                </p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${selectedPrivacy === 'Public'
                                    ? 'border-blue-500 bg-blue-500 flex items-center justify-center'
                                    : 'border-gray-500'
                                }`}>
                                {selectedPrivacy === 'Public' && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                        </div>

                        {/* Private Option */}
                        <div
                            onClick={() => selectPrivacy('Private')}
                            className="flex items-start gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer"
                        >
                            <Lock size={24} className="text-gray-400 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-semibold mb-1">Private</p>
                                <p className="text-sm text-gray-400">
                                    Only members can see who's in the group and what they post.
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    You might be able to change to public later.
                                </p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${selectedPrivacy === 'Private'
                                    ? 'border-blue-500 bg-blue-500 flex items-center justify-center'
                                    : 'border-gray-500'
                                }`}>
                                {selectedPrivacy === 'Private' && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Privacy Description */}
            <p className="text-xs text-gray-400 mb-6">
                Anyone can see who's in the group and what they post. You can change your group to private now or at a later time.{' '}
                <span className="text-blue-400 cursor-pointer hover:underline">Learn more about group privacy</span>
            </p>

            {/* Invite Friends Section */}
            {/* <div className="border-2 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-3">Invite friends</p>

                {invitedFriend && (
                    <div className="flex items-center gap-2 bg-blue-600 text-white rounded-full px-3 py-1 mb-3 w-fit">
                        <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                        <span className="text-sm">{invitedFriend}</span>
                        <button onClick={removeFriend} className="hover:bg-blue-700 rounded-full p-1">
                            <X size={14} />
                        </button>
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Enter names or email addresses"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none mb-3"
                />
                <div className="text-sm">
                    <span className="text-gray-400">Suggested: </span>
                    <span className="text-blue-400">Abhay Lalhal, Sunil Sanjan, T Tanvi</span>
                </div>
            </div> */}

            {/* Create Button */}
            <button className="w-full bg-gray-700 text-gray-500 rounded-lg py-3 mt-6 font-semibold cursor-not-allowed">
                Create
            </button>
        </>
    )
}

export default DetailsFill