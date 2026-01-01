import { Heart, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type RelatedPost = {
    id: string;
    description: string;
    likeCount: number;
    commentCount: number;
    user: {
        name: string | null;
        username: string;
        id: string;
    };
};


interface Props {
    relatedPosts: RelatedPost[]
}

const RelatedPosts: React.FC<Props> = ({ relatedPosts }) => {
    return (
        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
            <h3 className="mb-4 text-lg font-bold">Related Posts</h3>
            <div className="space-y-4">
                {relatedPosts.map(relatedPost => (
                    <Link
                        key={relatedPost.id}
                        href={`/community/post_details/${relatedPost.id}`}
                        className="block cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition hover:border-purple-500/40 hover:bg-white/10"
                    >
                        <div className="mb-2 flex items-center space-x-2">
                            <User className="h-4 w-4 text-purple-400" />

                            <p className="text-sm font-medium text-purple-400">{relatedPost.user.username}</p>
                        </div>
                        <p className="mb-3 text-sm text-gray-200">{relatedPost.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span className="flex items-center space-x-1">
                                <Heart className="h-3 w-3" />
                                <span>{relatedPost.likeCount}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{relatedPost.commentCount}</span>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default RelatedPosts