'use client'

import { useState } from 'react'
import { Comment } from '@/app/types/comment'
import axios from 'axios'
import { getTimeAgoFormatted } from '@/app/utils/date'
import { Heart, Send } from 'lucide-react'
import { BsHeartFill } from 'react-icons/bs'
import { ClipLoader } from 'react-spinners'
import Link from 'next/link'
import CommentSkeleton from '@/skeleton/CommentSkeleton'

interface CommentItemProps {
    comment: Comment
    postId: string
    level?: number
    onReply: (parentId: string, content: string) => Promise<void>
}

export default function CommentItem({ comment, postId, level = 0, onReply }: CommentItemProps) {
    const [replies, setReplies] = useState<Comment[]>([])
    const [showReplies, setShowReplies] = useState(false)
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyText, setReplyText] = useState('');
    const [replyUploading, setReplyUploading] = useState(false);
    const [replyCount, setReplyCount] = useState(comment._count?.replies || 0);

    const handleViewReplies = async () => {
        if (showReplies) {
            setShowReplies(false)
            return
        }

        setLoading(true)
        const res = await axios.post('/api/getreplies', { parentId: comment.id })
        setReplies(res.data.replies)
        setShowReplies(true)
        setLoading(false)
    }

    const handleReply = async () => {
        setReplyUploading(true);
        await onReply(comment.id, replyText);

        const res = await axios.post('/api/getreplies', { parentId: comment.id })
        setReplies(res.data.replies)
        setReplyCount(prev => prev + 1)
        setShowReplies(true)

        setReplyText('');
        setShowReplyBox(false);
        setReplyUploading(false);
    }

    return (
        <div style={{ marginLeft: level * 24 }}>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mt-3">
                <div className='flex flex-row items-center space-x-2'>
                    <Link href={`/player-profile/${comment.user.id}`} key={comment.user.id}>
                        {
                            comment.user.avatar ?
                                <div className=' h-12 w-12 rounded-full'>
                                    <img src={comment.user.avatar} alt="" className='rounded-full' />
                                </div>
                                :
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl">
                                    <img className='w-8 h-8' src="https://img.icons8.com/?size=100&id=7rcs0z3sdioE&format=png&color=000000" alt="" />
                                </div>

                        }
                    </Link>
                    <div>
                        <p className="font-semibold">{comment.user.name ?? comment.user.username ?? 'Anonymous'}</p>
                        <p className="text-xs text-gray-400 mb-2">{getTimeAgoFormatted(comment.createdAt)}</p>
                    </div>
                </div>

                <p className="text-gray-200">{comment.content}</p>

                <div className='flex flex-row items-center space-x-4 mt-2'>
                    <button
                        className="flex items-center space-x-1 text-gray-400 transition hover:text-pink-500"
                    >
                        {liked ? (
                            <BsHeartFill className="h-5 w-5" color="#B4157D" />
                        ) : (
                            <Heart className="h-5 w-5" />
                        )}
                        <span>{comment.likeCount}</span>
                    </button>
                    <div className="flex space-x-4 text-sm text-gray-400">
                        <button
                            onClick={() => setShowReplyBox(!showReplyBox)}
                            className="hover:text-pink-500"
                        >
                            Reply
                        </button>
                    </div>

                    {replyCount > 0 &&
                        <button
                            onClick={handleViewReplies}
                            className=" text-sm text-purple-400 hover:text-pink-400"
                        >{
                                showReplies
                                    ? 'Hide replies'
                                    : `View replies (${replyCount})`
                            }
                        </button>
                    }
                </div>
                {showReplyBox && (

                    <div className="mt-3 ml-6">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full h-20 rounded-lg border border-purple-500/20 bg-white/10 px-3 py-2 outline-none placeholder:text-gray-300"
                        />
                        <button
                            onClick={handleReply}
                            disabled={replyUploading}
                            className="mt-2 flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 text-sm font-semibold hover:from-purple-700 hover:to-pink-700"
                        >
                            {
                                replyUploading ?
                                    <ClipLoader color='white' size={25} />
                                    :
                                    <>
                                        <Send className="h-4 w-4" />
                                        <span>Reply</span>
                                    </>
                            }
                        </button>
                    </div>
                )}

            </div>
            {
                loading &&
                <div style={{ marginLeft: level+1 * 24 }}>
                    <CommentSkeleton count={1} />
                </div>

            }

            {showReplies &&
                replies.map((reply) => (
                    <CommentItem
                        key={reply.id}
                        comment={reply}
                        postId={postId}
                        level={level + 1}
                        onReply={onReply}
                    />
                ))}
        </div>
    )
}