'use client'

import React, { useEffect, useState } from 'react';
import { Twitch, Twitter, Youtube, Facebook, Instagram } from 'lucide-react';
import { BsDiscord, BsSteam } from 'react-icons/bs';
import axios from 'axios';
import { User } from '@prisma/client';
import { ClipLoader } from 'react-spinners';
import Cropper from "react-easy-crop";
import Link from 'next/link';


const EditProfilePage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [realName, setRealName] = useState('');
    const [bio, setBio] = useState('');
    const [socialLinks, setSocialLinks] = useState({
        twitch: "",
        x: '',
        steam: '',
        youtube: '',
        discord: '',
        facebook: '',
        instagram: ''
    });

    const [profile, setProfile] = useState<User | null>(null);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [usernameAvailability, setUsernameAvailability] = useState(true);

    const [previewProfilePic, setPreviewProfilePic] = useState('');

    const [fetchingAvailability, setFetchingAvailability] = useState(false);
    const [privacy, setPrivacy] = useState<boolean>()
    const [loading, setLoading] = useState(false);

    const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<null | {
        width: number;
        height: number;
        x: number;
        y: number;
    }>(null);
    const [rawImage, setRawImage] = useState<string | null>(null);

    const CLOUDINARY_CLOUD_NAME = "diwmvqto3";
    const CLOUDINARY_UPLOAD_PRESET = "crowd-app";


    const getProfile = async () => {
        try {
            const response = await axios({
                url: `/api/private/getprofile`,
                method: 'get'
            })
            console.log(response.data)
            const userData = response.data.user;
            setProfile(userData);
            
            setUsername(userData?.username || '');
            setRealName(userData?.name || '');
            setBio(userData?.bio || '');

            if (userData?.avatar) {
                setPreviewProfilePic(userData.avatar);
            }
            const visibility = userData.privacy === 'PUBLIC' ? true : false;
            setPrivacy(visibility)

            setSocialLinks({
                twitch: userData?.socialLinks[0].link || '',
                x: userData?.socialLinks[1].link || '',
                steam: userData?.socialLinks[5].link || '',
                youtube: userData?.socialLinks[6].link || '',
                discord: userData?.socialLinks[2].link || '',
                facebook: userData?.socialLinks[4].link || '',
                instagram: userData?.socialLinks[3].link || ''
            });

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(username);
        }, 400);

        return () => {
            clearTimeout(handler)
        }
    }, [username]);

    useEffect(() => {

        const fetchUsernameAvailability = async () => {
            setFetchingAvailability(true)
            if (username === profile?.username) {
                return;
            }
            try {
                const response = await axios({
                    url: `/api/get-username-availablity`,
                    method: 'post',
                    data: {
                        username: debouncedQuery
                    }
                })
                console.log(response.data)
                setUsernameAvailability(response.data.available);
            } catch (error) {
                console.log(error)
            } finally {
                setFetchingAvailability(false)
            }
        }

        fetchUsernameAvailability();

    }, [debouncedQuery])

    const uploadImageToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleSave = async () => {
        setLoading(true)
        try {
            if (!usernameAvailability || username.trim().length === 0) {
                return;
            }
            let profilePictureUrl = previewProfilePic;

            if (profilePic) {
                profilePictureUrl = await uploadImageToCloudinary(profilePic);
            }

            const response = await axios({
                url: `/api/private/update-profile`,
                method: 'post',
                data: {
                    username,
                    name: realName.trim(),
                    bio: bio.trim(),
                    profilePicture: profilePictureUrl,
                    twitch: socialLinks.twitch,
                    x: socialLinks.x,
                    steam: socialLinks.steam,
                    youtube: socialLinks.youtube,
                    discord: socialLinks.discord,
                    facebook: socialLinks.facebook,
                    instagram: socialLinks.instagram,
                    privacy: privacy ? 'PUBLIC' : 'PRIVATE'
                }
            })

            console.log('Profile updated successfully:', response.data);
            alert('Profile updated successfully!');

        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false)
        }
    }

    console.log(usernameAvailability)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imgURL = URL.createObjectURL(file);
        setRawImage(imgURL);
        setIsCropModalOpen(true);
    };


    const getCroppedImg = (
        imageSrc: string,
        pixelCrop: { x: number; y: number; width: number; height: number }
    ): Promise<Blob> => {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = imageSrc;

            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;

                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                }, "image/jpeg");
            };
        });
    };

    const applyCrop = async () => {
        if (!rawImage || !croppedAreaPixels) return;

        const croppedBlob = await getCroppedImg(rawImage, croppedAreaPixels);

        const croppedFile = new File([croppedBlob], "profile.jpg", {
            type: "image/jpeg"
        });

        setProfilePic(croppedFile);

        const previewURL = URL.createObjectURL(croppedFile);
        setPreviewProfilePic(previewURL);

        setIsCropModalOpen(false);
    };


    const onCropComplete = (
        _croppedArea: any,
        croppedPixels: { x: number; y: number; width: number; height: number }
    ) => {
        setCroppedAreaPixels(croppedPixels);
    };




    return (
        <div className="flex min-h-screen bg-[#131022] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <Link href="/profile" className="text-[#9a90cb] text-base font-medium hover:text-white ease-in-out duration-300">Profile</Link>
                        <span className="text-[#9a90cb] text-base font-medium">/</span>
                        <span className="text-white text-base font-medium">Edit Profile</span>
                    </div>

                    {/* Page Heading */}
                    <div className="flex flex-wrap justify-between gap-3 mb-8">
                        <h1 className="text-white text-4xl font-black tracking-tight">Edit Profile</h1>
                    </div>

                    {/* Profile Header */}
                    <div className="mb-10">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div className="flex gap-4 items-center">
                                <div
                                    className="w-32 h-32 rounded-full bg-cover bg-center bg-no-repeat flex-shrink-0"
                                    style={{ backgroundImage: `url(${previewProfilePic})` }}
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-white text-[22px] font-bold tracking-tight">{username || 'noobflick'}</p>
                                    <p className="text-[#9a90cb] text-base">Change your profile picture and personal details.</p>
                                </div>
                            </div>

                            <label className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#292249] hover:bg-[#4725f4]/30 transition-colors text-white text-sm font-bold w-full sm:w-auto cursor-pointer">
                                Change Picture
                                <input
                                    type="file"

                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/*Account Privacy Option */}
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="username" className="text-white text-base font-medium mb-2">Accont Privacy</label>
                        <div className='flex flex-row justify-between items-center w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 px-4 text-base '>
                            <span className=''>{privacy ? 'Public Account' : 'Private Account'}</span>
                            <div
                                onClick={() => {setPrivacy(prev => !prev) }}
                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition 
                         ${privacy ? "bg-purple-600" : "bg-gray-400"}`}
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition 
                        ${privacy ? "translate-x-6" : ""}`}
                                >

                                </div>

                            </div>

                        </div>
                    </div>




                    {/* Form */}
                    <div className="space-y-8">
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex flex-col">
                                    <label htmlFor="username" className="text-white text-base font-medium pb-2">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 px-4 text-base"
                                    />
                                </div>
                                <span className={`${usernameAvailability ? 'text-green-400' : 'text-red-400'} font-extralight text-sm ml-4`}>
                                    {
                                        username !== profile?.username &&
                                        <>
                                            {
                                                fetchingAvailability ?
                                                    <>
                                                        <ClipLoader size={10} color='white' />
                                                    </>
                                                    :
                                                    <>
                                                        {usernameAvailability ? 'Username is available!' : 'Username not available!'}
                                                    </>
                                            }

                                        </>
                                    }


                                </span>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="realname" className="text-white text-base font-medium pb-2">
                                    Real Name <span className="text-[#9a90cb]">(Optional)</span>
                                </label>
                                <input
                                    id="realname"
                                    type="text"
                                    value={realName}
                                    onChange={(e) => setRealName(e.target.value)}
                                    placeholder="Name"
                                    className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 px-4 text-base placeholder:text-[#9a90cb]"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="text-white text-base font-medium pb-2 block">Bio</label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about your gaming journey..."
                                className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 p-4 text-base placeholder:text-[#9a90cb] min-h-[120px] resize-y mt-2"
                            />
                        </div>

                        {/* Social Links */}
                        <div>
                            <h2 className="text-white text-xl font-bold tracking-tight mb-4">Social Links</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative flex items-center">
                                    <Twitch size={20} className="absolute left-4 text-[#9a90cb]" />
                                    <input
                                        type="text"
                                        value={socialLinks.twitch}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, twitch: e.target.value }))}
                                        placeholder="twitch.tv/username"
                                        className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                                    />
                                </div>
                                <div className="relative flex items-center">
                                    <Twitter size={20} className="absolute left-4 text-[#9a90cb]" />
                                    <input
                                        type="text"
                                        value={socialLinks.x}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, x: e.target.value }))}
                                        placeholder="x.com/username"
                                        className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                                    />
                                </div>
                                <div className="relative flex items-center">
                                    <BsSteam size={20} className="absolute left-4 text-[#9a90cb]" />
                                    <input
                                        type="text"
                                        value={socialLinks.steam}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, steam: e.target.value }))}
                                        placeholder="steam.com/username"
                                        className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                                    />
                                </div>
                                <div className="relative flex items-center">
                                    <Youtube size={20} className="absolute left-4 text-[#9a90cb]" />
                                    <input
                                        type="text"
                                        value={socialLinks.youtube}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                                        placeholder="youtube.com/username"
                                        className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                                    />
                                </div>
                                <div className="relative flex items-center">
                                    <BsDiscord size={20} className="absolute left-4 text-[#9a90cb]" />
                                    <input
                                        type="text"
                                        value={socialLinks.discord}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, discord: e.target.value }))}
                                        placeholder="discord.com/username"
                                        className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                                    />
                                </div>
                                <div className="relative flex items-center">
                                    <Facebook size={20} className="absolute left-4 text-[#9a90cb]" />
                                    <input
                                        type="text"
                                        value={socialLinks.facebook}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                                        placeholder="facebook.com/username"
                                        className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                                    />
                                </div>
                                <div className="relative flex items-center">
                                    <Instagram size={20} className="absolute left-4 text-[#9a90cb]" />
                                    <input
                                        type="text"
                                        value={socialLinks.instagram}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                                        placeholder="instagram.com/username"
                                        className="w-full rounded-lg text-white bg-[#1d1834] border border-[#3a3168] focus:border-[#4725f4] focus:outline-none focus:ring-2 focus:ring-[#4725f4]/50 h-14 pl-12 pr-4 text-base placeholder:text-[#9a90cb]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-white/10">
                            <button className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-6 bg-transparent text-[#9a90cb] hover:text-white text-base font-bold transition-colors">
                                Cancel
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleSave}
                                className="w-full sm:w-auto flex items-center justify-center rounded-lg h-12 px-6 bg-[#4725f4] hover:bg-[#4725f4]/80 text-white text-base font-bold transition-colors disabled:cursor-not-allowed"
                            >
                                {
                                    loading ?
                                        <ClipLoader color='white' size={23} />
                                        :

                                        'Save Changes'
                                }

                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {isCropModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-[#1d1834] p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-white text-xl font-bold mb-4">Crop your picture</h2>

                        <div className="relative w-full h-72 bg-black/40 rounded-lg overflow-hidden">
                            <Cropper
                                image={rawImage ?? undefined}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="mt-4">
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => setIsCropModalOpen(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 rounded-lg bg-[#4725f4] hover:bg-[#4725f4]/80 text-white font-bold"
                                onClick={applyCrop}
                            >
                                Apply Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EditProfilePage;