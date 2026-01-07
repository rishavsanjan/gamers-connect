'use client'
import ProfileGameList from '@/app/profile/ProfileGameList';
import { ProfileGame } from '@/app/types/game';
import { Collection } from '@prisma/client'
import axios from 'axios';
import { notFound } from 'next/navigation';
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners';

interface Props {
    games: ProfileGame[],
    totalGames: number
    collectionId: string
    visible: boolean
    collection: Collection
}

const InfiniteCollectionGamesList: React.FC<Props> = ({ games, totalGames, collectionId, visible, collection }) => {

    const [collectionGames, setCollectionGames] = useState(games);
    const [nextPage, setNextPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [visibility, setVisibility] = useState(visible);

    if(!collection) {
        return notFound();
    }


    const toggleVisibility = async () => {

        setVisibility(!visibility);

        try {
            const response = await axios({
                url: `/api/private/toggle-visibility`,
                method: 'post',
                data: {
                    collectionId
                }
            })

        } catch (error) {
            setVisibility(!visibility);
        }
    }

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
            setCollectionGames(prev => [...prev, ...response.data.games]);


        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className='pb-8 flex flex-col  items-center'>
            <div className='flex flex-row justify-between items-center w-full p-4'>
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2 sm:px-4 py-2 capitalize">
                        {collection.name}
                    </h1>
                    <span className='px-2 sm:px-4 text-sm sm:text-base text-gray-300 mb-4'>
                        {collection.description}
                    </span>
                </div>
                <div>
                    <div
                        onClick={() => {toggleVisibility()}}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition 
                         ${visibility ? "bg-purple-600" : "bg-gray-400"}`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition 
                        ${visibility ? "translate-x-6" : ""}`}
                        >

                        </div>

                    </div>
                    <span className=''>{visibility ? 'Public' : 'Private'}</span>
                </div>

            </div>


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