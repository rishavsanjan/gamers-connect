import { auth } from '@/auth'
import React from 'react'

const OwnerDetails = async () => {
    const session = await auth();

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
            <div>
                <p className="font-semibold">{session?.user.name || session?.user.username}</p>
                <p className="text-sm text-gray-400">Admin</p>
            </div>
        </div>
    )
}

export default OwnerDetails