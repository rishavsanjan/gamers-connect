'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Game } from "@/app/types/game"
import axios from 'axios';
import CreateCollectionModal from './modals/CreateCollectionModal';
import { GrAdd } from 'react-icons/gr';
import { LiaAngleRightSolid, LiaCheckSolid } from "react-icons/lia";
import { ClipLoader } from 'react-spinners';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addGameToCollection, fetchCollections } from '@/app/queries/games';

interface CollectionProps {
    game: Game
}

interface Collection {
    id: string,
    name: string,
    description: string,
    hasGame: boolean
}


const CollectionModal: React.FC<CollectionProps> = ({ game }) => {

    const [createCollectionModal, setCreateCollectionModal] = useState(false);
    const createCollectionRef = useRef<HTMLDivElement>(null);
    const [adding, setAdding] = useState('');
    const gameId = game.id;

    const { data, isLoading } = useQuery({
        queryKey: ['get-collections', gameId],
        queryFn: fetchCollections,
        enabled: !!gameId,
    })


    const collections = data?.collections;

    const queryClient = useQueryClient()

    const addGameMutation = useMutation({
        mutationFn: addGameToCollection,

        onMutate: async ({ collectionId }) => {
            setAdding(collectionId)

            await queryClient.cancelQueries({
                queryKey: ['get-collections', gameId],
            })

            const previous =
                queryClient.getQueryData<{
                    collections: Collection[]
                }>(['get-collections', gameId])

            queryClient.setQueryData(
                ['get-collections', gameId],
                (old: any) => {
                    if (!old) return old

                    return {
                        collections: old.collections.map((c: Collection) =>
                            c.id === collectionId
                                ? { ...c, hasGame: true }
                                : c
                        ),
                    }
                }
            )

            return { previous }
        },

        onError: (_err, _vars, context) => {
            queryClient.setQueryData(
                ['get-collections', gameId],
                context?.previous
            )
            setAdding('')
        },

        onSettled: () => {
            setAdding('')
            queryClient.invalidateQueries({
                queryKey: ['get-collections', gameId],
            })
        },
    })



    useEffect(() => {
        const createCollectionContainer = createCollectionRef.current;

        if (createCollectionModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        const handleCollectionClose = (e: MouseEvent) => {
            if (e.target === createCollectionContainer) {
                setCreateCollectionModal(false);
            }
        };

        createCollectionContainer?.addEventListener("mousedown", handleCollectionClose);

        return () => {
            document.body.style.overflow = "auto";
            createCollectionContainer?.removeEventListener("mousedown", handleCollectionClose);
        };
    }, [createCollectionModal]);
    const imgUrl = game?.cover.url
        ? `https:${game?.cover.url.replace("t_thumb", "t_screenshot_med")}`
        : "/placeholder.jpg";
    return (
        <div className='bg-[#1F1F1F]  flex flex-col  py-4'>
            <div className='flex flex-row w-96 justify-start gap-4 items-center px-4 pb-2'>
                <div>
                    <img className='w-32 h-20' src={`${imgUrl}`} alt="" />
                </div>
                <div>
                    <p>{game?.name || 'N/A'}</p>
                    <p>Add to list</p>
                </div>
            </div>

            <button
                onClick={() => { setCreateCollectionModal(true) }}
                className='flex flex-row justify-between items-center w-96 border-b border-gray-600 px-4 py-2 cursor-pointer hover:bg-gray-400 ease-in-out duration-300 transition-all'>
                <p>Create new list</p>
                <LiaAngleRightSolid />
            </button>
            {
                isLoading &&
                <div className='py-4 self-center'>
                    <ClipLoader color='white' />
                </div>

            }
            {
                collections?.length === 0 ?
                    <p className='text-center text-gray-300 font-medium text-xl'>No collections yet!</p>
                    :

                    <>
                        {
                            collections?.map((item, index) => (
                                <div key={index} className='flex flex-row justify-between   px-4 my-2 items-center cursor-pointer' >
                                    <div className='flex flex-row items-center gap-2'>
                                        {
                                            item.hasGame ?
                                                <button onClick={() => { }}>
                                                    <LiaCheckSolid color='green' />
                                                </button>

                                                :
                                                <>
                                                    {
                                                        adding === item.id ?
                                                            <ClipLoader color='white' size={10} />
                                                            :
                                                            <button onClick={() => { addGameMutation.mutate({ gameId, collectionId: item.id, game }) }}>
                                                                <GrAdd />
                                                            </button>



                                                    }

                                                </>



                                        }

                                        <p>{item.name}</p>
                                    </div>
                                    <div className='border-l border-gray-400 pl-2'>
                                        <LiaAngleRightSolid className='' />
                                    </div>

                                </div>
                            ))
                        }
                    </>
            }
            {
                createCollectionModal &&
                <div
                    ref={createCollectionRef}
                    className="h-screen w-full  absolute top-0 left-0 bg-black/50 z-[100] items-center justify-center flex flex-col gap-4">

                    <CreateCollectionModal setCreateCollectionModal={setCreateCollectionModal} gameId={gameId} />
                </div>
            }

        </div>
    )
}

export default CollectionModal