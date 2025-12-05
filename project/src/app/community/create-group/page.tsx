'use client'
import React, { useState } from 'react'
import { X } from 'lucide-react';

import { LuGamepad2 } from 'react-icons/lu';
import Link from 'next/link';
import PrivacySelector from './PrivacySelector';
import VisibilitySelector from './VisibilitySelector';
import GroupPreview from './GroupPreview';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';


const CreateGroup = () => {

    const [invitedFriend, setInvitedFriend] = useState('Aditya Lalhal Aditya');
    const [inputValue, setInputValue] = useState('');
    const [groupName, setGroupName] = useState('');
    const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
    const [selectedPrivacy, setSelectedPrivacy] = useState('Public');
    const removeFriend = () => {
        setInvitedFriend('');
    };
    const [loading, setLoading] = useState(false);

    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
    const [selectedVisibility, setSelectedVisibility] = useState('Visible');

    const selectPrivacy = (privacy: string) => {
        setSelectedPrivacy(privacy);
        setShowPrivacyMenu(false);
    };

    const selectVisibility = (visibility: string) => {
        setSelectedVisibility(visibility);
        setShowVisibilityMenu(false);
    };

    const handleGroupCreate = async () => {

        setLoading(true);

        try {
            const response = await axios({
                url: `/api/private/group/create-group`,
                method: 'post',
                data: {
                    visibility: selectedVisibility,
                    privacy: selectedPrivacy,
                    groupName
                }
            });
            console.log(response.data)
            setGroupName('');
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }


    }



    console.log(groupName)
    return (
        <div className='flex sm:flex-row flex-col'>
            <div className='sm:w-[25%]'>
                <div className="min-h-screen bg-gray-900 text-white sm:p-6 p-2 border-r border-gray-400">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button className="p-2 hover:bg-gray-800 rounded-full">
                            <X size={24} />
                        </button>
                        <div className='flex flex-row items-center gap-2  '>
                            <LuGamepad2 className='text-2xl text-purple-500' />
                            <Link href={'/'}>
                                <h1 className='bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-2xl'>Gamely</h1>
                            </Link>

                        </div>
                    </div>

                    {/* Breadcrumb and Title */}
                    <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-2">Groups &gt; Create group</p>
                        <h1 className="text-3xl font-bold">Create group</h1>
                    </div>

                    {/* Admin Info */}
                    {/* <OwnerDetails /> */}

                    {/* Group Name Input */}
                    <input
                        type="text"
                        placeholder="Group name"
                        value={groupName}
                        onChange={(e) => { setGroupName(e.target.value) }}
                        className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                    />

                    {/* Privacy Selector */}
                    <PrivacySelector showPrivacyMenu={showPrivacyMenu} selectPrivacy={selectPrivacy} setShowPrivacyMenu={setShowPrivacyMenu} selectedPrivacy={selectedPrivacy} />

                    {/* Privacy Description */}
                    <p className="text-xs text-gray-400 mb-6">
                        {selectedPrivacy === 'Public' ? "Anyone can see who's in the group and what they post. You can change your group to private now or at a later time." : "Only members can see who's in the group and what they post."}

                    </p>


                    {/* Visibility Selector */}
                    <VisibilitySelector showVisibilityMenu={showVisibilityMenu} selectVisibility={selectVisibility} setShowVisibilityMenu={setShowVisibilityMenu} selectedVisibility={selectedVisibility} />


                    {/* Visibilty Description */}
                    <p className="text-xs text-gray-400 mb-6">
                        {selectedVisibility === 'Visible' ? "Anyone can find this group." : "Can only be found using invite link."}

                    </p>



                    {/* Create Button */}
                    <button
                        disabled={groupName.trim().length < 3}
                        onClick={handleGroupCreate}
                        className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold transition hover:from-purple-700 hover:to-pink-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400">
                        {loading ? <ClipLoader color='white' size={30} /> : 'Create a group'}
                    </button>
                </div>
            </div>


            {/* Right Side */}
            <GroupPreview groupName={groupName} selectedVisibility={selectedVisibility} selectedPrivacy={selectedPrivacy} />


        </div>
    )
}

export default CreateGroup