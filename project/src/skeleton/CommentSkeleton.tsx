import React from 'react'

const Skeleton = () => {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mt-3 animate-pulse">
            {/* User Info Section */}
            <div className='flex flex-row items-center space-x-2'>
                {/* Avatar Skeleton */}
                <div className="h-12 w-12 rounded-full bg-gray-700"></div>

                <div className="flex-1">
                    {/* Name Skeleton */}
                    <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                    {/* Timestamp Skeleton */}
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
            </div>

            {/* Comment Content Skeleton */}
            <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>

            {/* Actions Section Skeleton */}
            <div className='flex flex-row items-center space-x-4 mt-3'>
                {/* Like Button Skeleton */}
                <div className="flex items-center space-x-1">
                    <div className="h-5 w-5 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-8"></div>
                </div>

                {/* Reply Button Skeleton */}
                <div className="h-4 bg-gray-700 rounded w-12"></div>

                {/* View Replies Skeleton */}
                <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
        </div>
    )
}

interface CommentSkeletonProps {
    count?: number
}

const CommentSkeleton: React.FC<CommentSkeletonProps> = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} />
            ))}
        </div>
    )
}


export default CommentSkeleton