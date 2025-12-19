'use client'
import React, { useEffect, useState } from 'react';
import Portal from '../Portal';

export default function PostImages({ mediaUrls }: { mediaUrls: string[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    useEffect(() => {
        document.body.style.overflow = selectedImage ? 'hidden' : 'auto'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [selectedImage]);


    function FeedImage({
        src,
        onClick,
    }: {
        src: string
        onClick: () => void
    }) {
        const [isPortrait, setIsPortrait] = useState(false)

        return (
            <div
                className={`relative cursor-pointer overflow-hidden rounded-lg bg-black
        ${isPortrait ? 'max-h-[420px]' : ''}
      `}
                onClick={onClick}
            >
                <img
                    src={src}
                    onLoad={(e) => {
                        const img = e.currentTarget
                        setIsPortrait(img.naturalHeight > img.naturalWidth)
                    }}
                    className={`
          w-full
          ${isPortrait
                            ? 'h-full object-contain bg-black'
                            : 'h-auto object-cover'
                        }
        `}
                    alt="post"
                />
            </div>
        )
    }


    return (
        <>
            {/* Image grid */}
            {mediaUrls.length > 0 && (
                <div
                    className={`
            mb-4 grid gap-2 rounded-xl overflow-hidden
            ${mediaUrls.length === 1 ? "grid-cols-1" : ""}
            ${mediaUrls.length === 2 ? "md:grid-cols-2 grid-cols-1" : ""}

            ${mediaUrls.length >= 3 ? "grid-cols-2 sm:grid-cols-3" : ""}
           `}
                >
                    {mediaUrls.slice(0, 4).map((image, index) => (
                        <div
                            key={index}
                            className={`relative cursor-pointer ${mediaUrls.length === 1 ? "col-span-2 sm:col-span-3" : ""
                                }`}
                            onClick={() => setSelectedImage(image)}
                        >
                            <FeedImage
                                src={image}
                                onClick={() => setSelectedImage(image)}
                            />


                            {index === 3 && mediaUrls.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold">
                                    +{mediaUrls.length - 4}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Image Modal (Lightbox) */}
            {selectedImage && (
                <Portal>
                    <div
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div
                            className="relative flex items-center justify-center w-full h-full p-6"
                            onClick={(e) => e.stopPropagation()} // prevent close on image click
                        >
                            {/* Image container */}
                            <div className="flex items-center justify-center bg-black rounded-lg max-w-[90vw] max-h-[90vh]">
                                <img
                                    src={selectedImage}
                                    className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain"
                                />
                            </div>

                            {/* Close button */}
                            <button
                                className="absolute top-4 right-4 text-white text-4xl hover:text-purple-400"
                                onClick={() => setSelectedImage(null)}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </Portal>

            )}

        </>
    );
}
