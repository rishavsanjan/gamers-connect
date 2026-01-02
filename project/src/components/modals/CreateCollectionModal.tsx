'use client'
import { createCollection } from '@/app/queries/games'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { SetStateAction, useState } from 'react'
import { ClipLoader } from 'react-spinners'

interface Collection {
    id: string
    name: string,
    description: string,
    hasGame: boolean
}

interface CreateCollectionProps {
    setCreateCollectionModal: React.Dispatch<React.SetStateAction<boolean>>
    gameId:number
}

const CreateCollectionModal: React.FC<CreateCollectionProps> = ({ setCreateCollectionModal , gameId}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });


    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createCollection,
        onSuccess: (newCollection) => {
            queryClient.setQueryData(
                ['get-collections', gameId],
                (old: any) => {
                    if (!old) {
                        return { collections: [newCollection] }
                    }
                    return {
                        collections: [
                            newCollection,
                            ...old.collections,
                        ],
                    }
                }
            )
            setCreateCollectionModal(false)
        }

    })



    return (
        <div className='bg-[#1F1F1F]  flex flex-col  py-4 w-96 p-4 gap-4'>
            <h1 className='text-center text-2xl font-medium'>Create a new collection</h1>
            <div className='flex flex-col gap-1'>
                <span>Title</span>
                <input
                    onChange={(e) => { setFormData(prev => ({ ...prev, name: e.target.value })) }}
                    className='placeholder:text-gray-600 border p-2 rounded-md border-gray-500' placeholder='Enter Title' type="text" />
            </div>
            <div className='flex flex-col gap-1'>
                <span>Title</span>
                <input
                    onChange={(e) => { setFormData(prev => ({ ...prev, description: e.target.value })) }}
                    className='placeholder:text-gray-600 border p-2 rounded-md border-gray-500' placeholder='Enter Description' type="text" />
            </div>
            <button
                onClick={() => { createMutation.mutate({ name: formData.name, description: formData.description }) }}
                className='bg-purple-400 p-2 px-4 cursor-pointer'>
                {
                    createMutation.isPending ?
                        <ClipLoader color='white' />
                        :
                        'Create List'
                }

            </button>
        </div>
    )
}

export default CreateCollectionModal