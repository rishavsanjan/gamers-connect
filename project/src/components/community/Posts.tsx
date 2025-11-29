import { Post } from '@/app/types/post'
import { handleLike, handleRemoveLike } from '@/app/utils/community_functions'
import { timeAgo } from '@/app/utils/date'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { BsHeartFill } from 'react-icons/bs'
import PostLikeButton from './PostLikeButton'
import PostDescription from './PostDescription'
import PostImages from './PostImages'

interface Props {
    posts: Post[]
}

const Posts: React.FC<Props> = ({ posts }) => {
    return (
        <div className='space-y-4'>
            {
                posts.map(post => (
                    <div key={post.id} className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg transition hover:border-purple-500/40 ">
                        {/* Post Header */}
                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl">
                                    <Link href={`/player-profile/${post.user.id}`} key={post.user.id}>
                                        <img className='w-8 h-8' src="https://img.icons8.com/?size=100&id=7rcs0z3sdioE&format=png&color=000000" alt="" />
                                    </Link>

                                </div>
                                <div>
                                    <p className="font-bold">{post.user.name || post.user.username}</p>
                                    <p className="text-sm text-gray-400">
                                        {
                                            post.game &&
                                            <>
                                                {/* @ts-ignore */}
                                                <Link href={`/details/${post.game.igdb_id}`} key={post.game.igdb_id}>
                                                    <span className="text-purple-400">{post.game.name}</span>
                                                </Link>
                                                {' '}  • {' '}
                                            </>
                                        }
                                        {
                                            post.group &&
                                            <>
                                                <Link href={`/group/${post.group.id}`} key={post.group.id}>
                                                    <span className="text-purple-400">{post.group.name}</span>
                                                </Link>
                                                {' '}  • {' '}
                                            </>
                                        }
                                        {timeAgo(post.createdAt)}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Post Content */}
                        <Link href={`/community/post_details/${post.id}`} key={post.id}>
                            <PostDescription text={post.description} />
                        </Link>

                        {/* Post Image Placeholder */}
                        {post.mediaUrls.length > 0 && (
                            <PostImages mediaUrls={post.mediaUrls} />
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center space-x-6 border-t border-white/10 pt-4">
                            <PostLikeButton postId={post.id} likeCount={post.likeCount} hasLiked={post.hasLiked} />
                            <button className="flex items-center space-x-2 text-gray-400 transition hover:text-purple-400">
                                <MessageCircle className="h-5 w-5" />
                                <span>{post.commentCount}</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-400 transition hover:text-blue-400">
                                <Share2 className="h-5 w-5" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Posts