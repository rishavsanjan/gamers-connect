import React from 'react'

import { CollectionTab } from '@/app/types/profile'

interface Props {
    collections: CollectionTab[]
}


const ProfileCollection: React.FC<Props> = ({ collections }) => {
    console.log(collections)
    return (
        <div className='grid grid-cols-2 gap-8 p-8'>
            {
                collections.map((item) => {
                    const imgUrl = item.games[0]?.cover
                        ? `https:${item.games[0]?.cover.replace("t_thumb", "t_screenshot_med")}`
                        : "/placeholder.jpg";
                    console.log(imgUrl)
                    return (
                        <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl shadow-lg h-64">
                            <img
                                src={imgUrl}
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-black/70"></div>

                            <h1 className="text-2xl font-bold text-white border-b border-gray-300 z-10">{item.name}</h1>
                            <div className="flex flex-col items-center text-white z-10">
                                <h1>{item.games?.length || 0}</h1>
                                <span>Games</span>
                            </div>
                        </div>

                    )
                })
            }
        </div>
    )
}

export default ProfileCollection