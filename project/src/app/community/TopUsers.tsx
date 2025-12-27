import { auth } from '@/auth'
import { useUser } from '@/context/UserContext'
import Link from 'next/link'
import React from 'react'
import { AiOutlineTrophy } from 'react-icons/ai'

interface Props {
    topGamers: Array<{
        username: string,
        avatar: string | null
        id: string
        postCount: number
    }>
}

const TopUsers: React.FC<Props> = async ({ topGamers }) => {
    const session = await auth();
    return (
        <div className="bg-white dark:bg-[#1E1538] rounded-xl p-5 shadow-lg border border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-white/5 pb-3">
                <AiOutlineTrophy className='text-yellow-500 text-2xl' />
                <h3 className="font-bold text-gray-900 dark:text-white">Top Gamers</h3>
            </div>
            <div className="space-y-3">
                {topGamers.map((gamer, index) => (
                    <div key={index} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                {gamer.avatar ? (
                                    <img alt="Avatar" className="w-8 h-8 rounded-full" src={gamer.avatar} />
                                ) : (
                                    <div className={`w-8 h-8 rounded-full ${index === 1 ? 'bg-purple-900' : 'bg-indigo-900'} flex items-center justify-center text-xs font-bold ${index === 1 ? 'text-purple-300' : 'text-indigo-300'}`}>
                                        {gamer.username[0].toUpperCase()}
                                    </div>
                                )}
                                <span className={`absolute -bottom-1 -right-1 text-[10px] ${index === 0 ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white'} px-1 rounded-full font-bold`}>
                                    {index + 1}
                                </span>
                            </div>
                            <Link href={`${session?.user.id === gamer.id ? `/profile` : `/player-profile/${gamer.id}`} `} key={gamer.id}>
                                <span className="text-sm text-blue-600 dark:text-[#00BFFF] font-medium group-hover:underline">@{gamer.username}</span>
                            </Link>
                        </div>

                        <span className="text-sm font-bold text-gray-700 dark:text-white bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">{gamer.postCount}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopUsers