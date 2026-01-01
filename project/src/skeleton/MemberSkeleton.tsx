import React from 'react'

const Skeleton = () => {
    return (
        <div className="flex items-center gap-3 flex-1 animate-pulse">
            {/* Avatar Skeleton */}
            <div className="w-12 h-12 rounded-full bg-gray-700"></div>

            {/* Member Info Skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                    {/* Name Skeleton */}
                    <div className="h-5 bg-gray-700 rounded w-32"></div>
                    {/* Badge Skeleton */}
                    <div className="h-6 bg-gray-700 rounded w-16"></div>
                </div>
                {/* Username Skeleton */}
                <div className="h-4 bg-gray-700 rounded w-24"></div>
            </div>
        </div>
    )
}

interface MemberCardSkeletonProps {
    count?: number
}

const MemberCardSkeleton: React.FC<MemberCardSkeletonProps> = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} />
            ))}
        </div>
    )
}

export default MemberCardSkeleton