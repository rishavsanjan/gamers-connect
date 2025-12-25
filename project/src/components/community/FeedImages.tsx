'use client'
import React, { useState } from 'react'

interface FeedImageProps {
    src: string
    onClick: () => void
}

const FeedImage: React.FC<FeedImageProps> = ({ src, onClick }) => {
    const [isPortrait, setIsPortrait] = useState(false)

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
            className={`relative overflow-hidden rounded-lg bg-black cursor-pointer
        ${isPortrait ? 'max-h-[420px]' : ''}
      `}
        >
            <img
                src={src}
                loading="lazy"
                alt="Post media"
                onLoad={(e) => {
                    const img = e.currentTarget
                    setIsPortrait(img.naturalHeight > img.naturalWidth)
                }}
                className={`
          w-full transition-opacity duration-200
          ${isPortrait
                        ? 'h-full object-contain bg-black'
                        : 'h-auto object-cover'
                    }
        `}
            />
        </div>
    )
}

export default FeedImage
