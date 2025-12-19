'use client'
import { Edit, Lock, Save, Share2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import JoinLeaveButton from './JoinLeaveButton'
import { useGroupDetails } from '@/context/GroupsContext'
import Cropper from 'react-easy-crop'
import axios from 'axios'
import { uploadImageToCloudinary } from '@/app/utils/community_functions'
import { ClipLoader } from 'react-spinners'

interface Props {

}

const GroupHeader: React.FC<Props> = ({ }) => {
    const { memberCount, membersState, groupState, setGroupState, userRole } = useGroupDetails();
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
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
    const containerRef = useRef<HTMLDivElement>(null)
    const [aspect, setAspect] = useState(16 / 9);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return

        const width = containerRef.current.offsetWidth
        const height = 350
        setAspect(width / height)
    }, [])
    console.log(groupState)

    const handleGroupUpdate = async () => {
        setUploading(true)
        try {
            let coverPictureUrl = preview;

            if (coverImage) {
                coverPictureUrl = await uploadImageToCloudinary(coverImage);
            }

            const response = await axios({
                url: `/api/private/group/group-update`,
                method: 'post',
                data: {
                    groupId: groupState.id,
                    coverImage: coverPictureUrl
                }
            })
            setGroupState(prev => ({
                ...prev,
                coverImage: coverPictureUrl,
            }));
            setIsEditing(false);

        } catch (error) {
            console.log(error)
        } finally {
            setUploading(false)
        }
    }


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

        setCoverImage(croppedFile);

        const previewURL = URL.createObjectURL(croppedFile);
        setPreview(previewURL);

        setIsCropModalOpen(false);
    };


    const onCropComplete = (
        _croppedArea: any,
        croppedPixels: { x: number; y: number; width: number; height: number }
    ) => {
        setCroppedAreaPixels(croppedPixels);
    };


    return (
        <div className="  relative z-10">
            <div className='relative'>
                {
                    preview ?
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-[350px] object-center"
                        />
                        :
                        <>
                            {
                                groupState.coverImage ?
                                    <img
                                        src={groupState.coverImage}
                                        className="w-full h-[350px] object-center"
                                    />
                                    :
                                    <div
                                        className="w-full h-[350px] bg-cover bg-center relative mb-4"
                                        style={{
                                            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(24,25,26,0.9)), url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1400&h=350&fit=crop')`
                                        }}
                                    />
                            }
                        </>


                }


                {
                    isEditing ?
                        <div>
                            <button
                                onClick={() => {
                                    setPreview('');
                                    setIsEditing(false);
                                }}
                                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg font-bold absolute right-32 bottom-6 cursor-pointer hover:bg-white/30 transition min-w-20 min-h-10"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={uploading}
                                onClick={handleGroupUpdate}
                                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg font-bold absolute right-6 bottom-6 cursor-pointer hover:bg-white/30 transition disabled:cursor-not-allowed min-w-20 justify-center min-h-10"
                            >
                                {
                                    uploading ?
                                        <ClipLoader color='white' size={20} />
                                        :
                                        <>
                                            <Save size={15} />
                                            Save
                                        </>
                                }

                            </button>
                        </div>
                        :
                        <>
                            {
                                userRole === 'owner' &&
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="edit-image"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const imgURL = URL.createObjectURL(file);
                                                setRawImage(imgURL);
                                                setIsCropModalOpen(true);
                                                setIsEditing(true)
                                            }}
                                        />

                                        <label
                                            htmlFor="edit-image"
                                            className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg font-bold absolute right-6 bottom-6 cursor-pointer hover:bg-white/30 transition"
                                        >
                                            <Edit size={15} />
                                            Edit
                                        </label>
                                    </> 
                            }


                        </>
                }
            </div>

            <h1 className="text-4xl font-bold mb-2 text-white">{groupState.name}</h1>

            <div className="flex items-center gap-2 text-[#b0b3b8] text-[15px] mb-5">
                <Lock size={16} />
                <span>{groupState.privacy === 'PRIVATE' ? 'Private Group' : 'Public Group'} · {memberCount} Members</span>
            </div>

            <div className="flex mb-5">
                {
                    membersState?.map((member, idx) => (
                        <div
                            key={idx}
                            className="w-9 h-9 rounded-full border-2 border-[#18191a] -ml-2 first:ml-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold"
                        >
                            <span>{member.username[0].toUpperCase()}</span>
                        </div>
                    ))
                }
                {
                    memberCount > 5 &&
                    <div className="w-9 h-9 rounded-full border-2 border-[#18191a] -ml-2 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-semibold">
                        +{memberCount - 5}
                    </div>
                }
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">

                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#3a3b3c] text-[#e4e6eb] rounded-md font-semibold hover:bg-[#4e4f50] transition-colors">
                    <Share2 size={18} />
                    Share
                </button>
                <JoinLeaveButton groupId={groupState.id} hasJoined={groupState.hasJoined} />
            </div>
            {isCropModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-[#1d1834] p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-white text-xl font-bold mb-4">Crop your picture</h2>

                        <div ref={containerRef} className="relative w-full h-72 bg-black/40 rounded-lg overflow-hidden">
                            <Cropper
                                image={rawImage ?? undefined}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}

                                cropShape="rect"
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
    )
}

export default GroupHeader