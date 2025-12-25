import { TrendingUp } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Props {
    topTags: Array<{
        name: string,
        id: string,
        tagCount: number
    }>
}

const TrendingTags: React.FC<Props> = ({ topTags }) => {
    return (
        <div className="bg-white dark:bg-[#1E1538] rounded-xl p-5 shadow-lg border border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-white/5 pb-3">
                <TrendingUp className="h-5 w-5 text-[#D9008F] " />
                <h3 className="font-bold text-gray-900 dark:text-white">Trending Topics</h3>
            </div>
            <div className="space-y-3">
                {
                    topTags?.map((tag) => (
                        <Link href={`/community/hashtag_posts/${tag.name}`} key={tag.name}>
                            <ul className='flex flex-row justify-between'>
                                <li className='text-blue-500 cursor-pointer'>#{tag.name}</li>
                                <li>{tag.tagCount}</li>
                            </ul>
                        </Link>
                    ))
                    ||
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-gray-500 dark:text-[#A799CC] italic">No top tags currently.</p>
                            <p className="text-xs text-gray-400">Be the first to start a trend!</p>
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}

export default TrendingTags