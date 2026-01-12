import { MessageCircle } from 'lucide-react'
import React from 'react'

interface Props {
    commentCount: number
}

const PostCommentCount: React.FC<Props> = ({ commentCount }) => {
    return (
        <div className="flex items-center space-x-2 text-gray-400">
            <MessageCircle className="h-6 w-6" />
            <span className="text-lg font-semibold">{commentCount}</span>
        </div>
    )
}

export default PostCommentCount