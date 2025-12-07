import React from 'react'

import { CollectionTab } from '@/app/types/profile'

interface Props {
    collections: CollectionTab[]
}


const ProfileCollection: React.FC<Props> = ({ collections }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8'>
            {
                collections.map((item, index) => {
                    const imgUrl = item.games[0]?.cover
                        ? `https:${item.games[0]?.cover.replace("t_thumb", "t_screenshot_med")}`
                        : "/placeholder.jpg";
                    return (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl shadow-xl h-72 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <img
                                src={imgUrl}
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                            <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
                                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">{item.name}</h1>
                                <div className="flex flex-col items-center">
                                    <span className="text-5xl font-extrabold text-white drop-shadow-lg">{item.games?.length || 0}</span>
                                    <span className="text-sm font-medium text-gray-300 uppercase tracking-wider mt-1">Games</span>
                                </div>
                            </div>

                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                    )
                })
            }
        </div>
    )
}

export default ProfileCollection