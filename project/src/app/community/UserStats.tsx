import Link from 'next/link'
import React from 'react'
import { RiBarChart2Fill } from 'react-icons/ri'

interface Props {
    postCount: number
    followers: number
    xp: number
}

const UserStats: React.FC<Props> = ({ postCount, followers, xp }) => {
    return (
        <div className="bg-white dark:bg-[#1E1538] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9008F]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Your Stats</h3>
                <RiBarChart2Fill className='text-gray-400 dark:text-[#A799CC] text-lg' />
            </div>
            <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-default">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Posts</span>
                    <span className="text-xl font-bold text-[#D9008F]">{postCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-default">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Followers</span>
                    <span className="text-xl font-bold text-[#9F00B5]">{followers}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-default">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">XP</span>
                    <span className="text-xl font-bold text-green-400">{xp}</span>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
                <Link
                    href="/profile"
                    className="text-sm text-center block text-gray-500 dark:text-[#A799CC] hover:text-[#D9008F] transition-colors"
                >
                    View full profile
                </Link>



            </div>
        </div>
    )
}

export default UserStats