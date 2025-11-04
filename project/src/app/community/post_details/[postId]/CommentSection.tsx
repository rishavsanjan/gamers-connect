'use client';
import { useState } from 'react';
import { Heart, Send, MoreHorizontal, Flag } from 'lucide-react';
import { Comment } from '@/app/types/comment';
import axios from 'axios';
import { getTimeAgoFormatted } from '@/app/utils/date';

interface Props {
    postId:string,
    initialComments:Comment[]
}

export default function CommentSection({ postId, initialComments }: Props) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);

    const handleAddComment = async () => {
        const response = await axios({
            url: `/api/private/addcomment`,
            method: 'post',
            data: {
                postId,
                content: commentText
            }
        })

        // setComments(prev => prev.map((comment) => {

        // }))
    };

    // const handleLikeComment = (commentId: number) => {
    //     setComments(comments.map((c: Comment) =>
    //         c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    //     ));
    // };

    console.log(comments)

    return (
        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-8 backdrop-blur-lg">
            <h2 className="mb-6 text-2xl font-bold">Comments ({comments.length})</h2>

            {/* Add Comment */}
            <div className="mb-8 rounded-xl border border-purple-500/20 bg-white/5 p-4">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="mb-4 h-24 w-full resize-none rounded-lg border border-purple-500/20 bg-white/10 px-4 py-3 outline-none transition focus:border-purple-500/60 placeholder:text-gray-300"
                />
                <button
                    onClick={handleAddComment}
                    className="ml-auto flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 font-semibold transition hover:from-purple-700 hover:to-pink-700"
                >
                    <Send className="h-4 w-4" />
                    <span>Comment</span>
                </button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment: any) => (
                    <div key={comment.id}>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl">
                                        {comment.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{comment.user.name}</p>
                                        <p className="text-xs text-gray-400">{getTimeAgoFormatted(comment.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="mb-3 text-gray-200">{comment.content}</p>
                            <button
                                // onClick={() => handleLikeComment(comment.id)}
                                className="flex items-center space-x-1 text-sm text-gray-400 transition hover:text-pink-500"
                            >
                                <Heart className="h-4 w-4" />
                                <span>{comment.likeCount}</span>
                            </button>
                        </div>

                        {/* Replies */}
                        {comment.replies?.length > 0 && (
                            <div className="ml-12 mt-4 space-y-4">
                                {comment.replies.map((reply: any) => (
                                    <div key={reply.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                                        <div className="mb-3 flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl">
                                                {reply.avatar}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{reply.author}</p>
                                                <p className="text-xs text-gray-400">{reply.timestamp}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-200">{reply.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}