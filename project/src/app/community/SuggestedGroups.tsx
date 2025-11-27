import { GroupIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SuggestedGroups = () => {
    return (
        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
            <h3 className="mb-4 text-lg font-bold">Suggested Groups</h3>
            <Link href={'/community/create-group'}>
                <button
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold transition hover:from-purple-700 hover:to-pink-700"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New Group</span>
                </button>
            </Link>

        </div>
    )
}

export default SuggestedGroups