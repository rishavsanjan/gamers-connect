import React from 'react'
import { Game } from '@/app/types/game';
import { formatUnixDate } from '@/app/utils/date';
import { IoGameController } from 'react-icons/io5';
import YouTubePlayer from '@/app/utils/ytplayer';

interface RightSideProps {
    game: Game
}

const RightSide: React.FC<RightSideProps> = ({ game }) => {
    return (
        <div className='z-100 md:w-[30%] w-full flex flex-col gap-4 p-8'>
            {
                game?.videos?.length > 0 &&
                <div>
                    <YouTubePlayer videoId={game?.videos[0].video_id || 'N/A'} />
                </div>
            }

            <div className='grid grid-cols-2 gap-4'>
                {
                    game.screenshots.map((image, index) => {
                        const imgUrl = image?.url
                            ? `https:${image.url.replace("t_thumb", "t_screenshot_med")}`
                            : "/placeholder.jpg";
                        if (index > 3) return;
                        return (

                            <div key={index}>
                                <img src={`${imgUrl}`} alt="" />
                            </div>
                        )
                    })
                }
            </div>
            <span className='text-gray-600 font-medium text-xl'>Where to buy</span>
            <div className='grid grid-cols-2 gap-4'>
                {
                    game?.websites?.map((store) => {
                        let storeName = '';
                        let storeLogo = '';
                        if (store.type === 13) {
                            storeLogo = 'https://img.icons8.com/?size=100&id=kBZ9gLW27vrQ&format=png&color=FFFFFF'
                            storeName = 'Steam'
                        } else if (store.type === 16) {
                            storeLogo = 'https://img.icons8.com/?size=100&id=44492&format=png&color=FFFFFF'
                            storeName = 'Epic Games'
                        } else if (store.type === 22) {
                            storeLogo = 'https://img.icons8.com/?size=100&id=12504&format=png&color=FFFFFF'
                            storeName = 'Xbox'
                        } else if (store.type === 23) {
                            storeLogo = 'https://img.icons8.com/?size=100&id=12519&format=png&color=FFFFFF'
                            storeName = 'Play Station'
                        } else {
                            return;
                        }
                        return (
                            <div key={store.id} className=''>
                                <a className='flex flex-row items-center gap-2' href={`${store.url}`} target='_blank'>
                                    <img className='w-8 h-8' src={`${storeLogo}`} alt="" />
                                    <span>{storeName}</span>
                                </a>

                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}

export default RightSide