// components/skeletons/PostsSkeleton.tsx
import React from 'react'

const Skeleton = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`animate-pulse rounded-md bg-slate-800/50 ${className}`} />
    )
}

const SinglePostSkeleton = () => {
    return (
        <div className="rounded-2xl border border-purple-500/20 bg-white/5 md:p-6 p-2 backdrop-blur-lg">
            {/* Post Header */}
            <div className="mb-4 flex justify-between">
                <div className="flex items-center space-x-3">
                    {/* Avatar skeleton */}
                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />

                    {/* User info skeleton */}
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>

                {/* Menu button skeleton */}
                <Skeleton className="h-6 w-6 rounded" />
            </div>

            {/* Post Description */}
            <div className="mb-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Post Image Placeholder */}
            <Skeleton className="h-64 md:h-80 w-full rounded-lg mb-4" />

            {/* Post Actions */}
            <div className="flex items-center space-x-6 border-t border-white/10 pt-4">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        </div>
    )
}

interface PostsSkeletonProps {
    count?: number
}

const PostsSkeleton: React.FC<PostsSkeletonProps> = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <SinglePostSkeleton key={index} />
            ))}
        </div>
    )
}

export default PostsSkeleton

