'use client'
import ProfileGameList from '@/app/profile/ProfileGameList';
import { ProfileGame } from '@/app/types/game';
import { Game } from '@prisma/client'
import axios from 'axios';
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners';

interface Props {
    games: ProfileGame[],
    totalGames: number
    collectionId: string
}

const InfiniteCollectionGamesList: React.FC<Props> = ({ games, totalGames, collectionId }) => {

    const [collectionGames, setCollectionGames] = useState(games);
    const [nextPage, setNextPage] = useState(2);
    const [loading, setLoading] = useState(false)

    const loadMore = async () => {
        setLoading(true)
        try {
            const response = await axios({
                url: `/api/private/get-collection-games?page=${nextPage}`,
                method: 'post',
                data: {
                    collectionId
                }
            })
            console.log(response.data)
            const games = response.data.games.map((item: any) => { return item.game })

            setCollectionGames(prev => [...prev, games]);


        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className='pb-8 flex flex-col  items-center'>
            <ProfileGameList gamesList={collectionGames} />
            <div className={`${totalGames === collectionGames.length && 'bg-transparent hover:bg-transparent'} hover:bg-[#FFFFFF] px-12 py-2 self-center bg-[#282828] hover:text-black ease-in-out duration-300 transition-all`}>
                {
                    loading ?

                        <ClipLoader color='gray' />
                        :
                        <>
                            {
                                totalGames !== collectionGames.length &&
                                < button onClick={() => {
                                    setNextPage(prev => prev + 1);
                                    loadMore();
                                }}>
                                    Load More
                                </button>
                            }
                        </>


                }
            </div>
        </div>
    )
}

export default InfiniteCollectionGamesList