import { Filter } from 'lucide-react'
import React from 'react'

const FilterButtonHomeFeed = () => {
    return (
        <div className="flex items-center space-x-4 rounded-2xl border border-purple-500/20 bg-white/5 p-4 backdrop-blur-lg">
            <Filter className="h-5 w-5 text-purple-400" />
            <select className="flex-1 cursor-pointer border-none bg-transparent outline-none">
                <option className="bg-gray-900">All Games</option>
                <option className="bg-gray-900">Elden Ring</option>
                <option className="bg-gray-900">Valorant</option>
                <option className="bg-gray-900">Stardew Valley</option>
            </select>
            <select className="cursor-pointer border-none bg-transparent outline-none">
                <option className="bg-gray-900">Latest</option>
                <option className="bg-gray-900">Popular</option>
                <option className="bg-gray-900">Trending</option>
            </select>
        </div>
    )
}

export default FilterButtonHomeFeed