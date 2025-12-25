'use client'
import React, { useEffect, useState, useCallback } from 'react'
import Portal from '../Portal'
import FeedImage from './FeedImages'

export default function PostImages({ mediaUrls }: { mediaUrls: string[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    // Disable scroll when modal open
    useEffect(() => {
        document.body.style.overflow = selectedImage ? 'hidden' : 'auto'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [selectedImage])

    // ESC to close
    useEffect(() => {
        if (!selectedImage) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelectedImage(null)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [selectedImage])

    const openImage = useCallback((src: string) => {
        setSelectedImage(src)
    }, [])

    if (mediaUrls.length === 0) return null

    const gridCols =
        mediaUrls.length === 1
            ? 'grid-cols-1'
            : mediaUrls.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-2 sm:grid-cols-3'

    return (
        <>
            {/* Image Grid */}
            <div className={`mb-4 grid gap-2 rounded-xl overflow-hidden ${gridCols}`}>
                {mediaUrls.slice(0, 4).map((image, index) => (
                    <div
                        key={index}
                        className={mediaUrls.length === 1 ? 'col-span-2 sm:col-span-3' : ''}
                    >
                        <FeedImage src={image} onClick={() => openImage(image)} />

                        {index === 3 && mediaUrls.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold rounded-lg">
                                +{mediaUrls.length - 4}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <Portal>
                    <div
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div
                            className="relative max-w-[90vw] max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Expanded view"
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                            />

                            <button
                                aria-label="Close"
                                className="absolute -top-10 right-0 text-white text-4xl hover:text-purple-400"
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
