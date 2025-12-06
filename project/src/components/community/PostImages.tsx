'use client'
import React, { useState } from 'react';

export default function PostImages({ mediaUrls }: { mediaUrls: string[] }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                            <img
                                src={image}
                                alt={`media-${index}`}
                                className="w-full h-64 object-cover rounded-lg hover:opacity-90 transition"
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
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedImage(null)} // close when clicking outside
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh]">
                        <button
                            className="absolute -top-10 right-0 text-white text-3xl hover:text-purple-400"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
