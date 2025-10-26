'use client'
import axios from 'axios'
import React, { SetStateAction, useState } from 'react'

interface Collection {
    id: string
    name: string,
    description: string,
    hasGame:boolean
}

interface CreateCollectionProps {
    setCollection: React.Dispatch<React.SetStateAction<Collection[] | undefined>>
    setCreateCollectionModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCollectionModal: React.FC<CreateCollectionProps> = ({ setCollection, setCreateCollectionModal }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });


    const handleCollectionCreation = async () => {
        const response = await axios({
            url: '/api/private/createcollection',
            method: 'POST',
            data: {
                name: formData.name,
                description: formData.description
            }
        })

        //@ts-ignore
        setCollection(prev => [...prev, response.data.collection])
        setCreateCollectionModal(false)
        console.log(response.data)
    }

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
                onClick={() => { handleCollectionCreation() }}
                className='bg-purple-400 p-2 px-4 cursor-pointer'>
                Create List
            </button>
        </div>
    )
}

export default CreateCollectionModal