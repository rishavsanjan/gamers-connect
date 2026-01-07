'use client'
import React, { useState } from 'react'
import Portal from '../Portal'

interface Props {
    screenshots: Array<{
        url: string
    }>
}

const GameImages: React.FC<Props> = ({ screenshots }) => {
    const [images, setImages] = useState(screenshots);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    return (
        <>
            <div className='grid grid-cols-2 gap-4 cursor-pointer'>
                {
                    images.map((image, index) => {
                        const imgUrl = image?.url
                            ? `https:${image.url.replace("t_thumb", "t_screenshot_med")}`
                            : "/placeholder.jpg";
                        if (index > 3) return;
                        return (

                            <div
                                key={index}

                                onClick={() => {
                                    let url = `https:${image.url.replace("t_thumb", "t_1080p")}`;
                                    setSelectedImage(url)

                                }}
                            >
                                <img src={`${imgUrl}`} alt="" />
                            </div>
                        )
                    })
                }

            </div>
            {selectedImage && (
                <Portal>
                    <div
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div
                            className="relative flex items-center justify-center w-full h-full p-6 cursor-pointer"
                            onClick={(e) => e.stopPropagation()} // prevent close on image click
                        >
                            {/* Image container */}
                            <div className="flex items-center justify-center bg-black rounded-lg  w-full h-full cursor-pointer">
                                <img
                                    src={selectedImage}
                                    className=" w-full h-full  object-contain"
                                />
                            </div>

                            {/* Close button */}
                            <button
                                className="absolute top-4 right-4 text-white text-4xl hover:text-purple-400 cursor-pointer"
                                onClick={() => setSelectedImage(null)}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </Portal>

            )}
        </>

    )
}

export default GameImages