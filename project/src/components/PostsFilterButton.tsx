import { Filter } from 'lucide-react'
import React, { SetStateAction } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface Props {
    category: string,
    filter: string,
    setCategory: React.Dispatch<SetStateAction<string>>
    setFilter: React.Dispatch<SetStateAction<string>>
}

const PostsFilterButton: React.FC<Props> = ({ category, filter, setCategory, setFilter }) => {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-purple-500/20 bg-white/5 p-4 backdrop-blur-lg mb-4  mt-4">
            <Filter className="h-5 w-5 text-purple-400" />

            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="flex-1 bg-transparent">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    {["ALL", "QUERY", "REVIEW", "SCREENSHOT", "NEWS", "GUIDE", "HELP"].map(item => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[120px] bg-transparent">
                    <SelectValue placeholder="Latest" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default PostsFilterButton