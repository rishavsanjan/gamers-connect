import React from 'react'
import { prisma } from '@/lib/prisma'
import { Heart, MessageCircle, Share2, TrendingUp, Award, ArrowLeft, MoreHorizontal, Flag, Bookmark, User, Clock, Eye } from 'lucide-react';
import PostActions from './PostActions';
import CommentSection from './CommentSection';
import AuthorCard from './AuthorCard';
import { getTimeAgoFormatted, timeAgo } from '@/app/utils/date';
import { auth } from '@/auth';
import LikeButton from './LikeButton';
import PostDescription from '@/components/community/PostDescription';
import PostImages from '@/components/community/PostImages';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CopyButton from '@/components/CopyButton';

interface Props {
    params: Promise<{ postId: string }>
}

const PostDetails: React.FC<Props> = async ({ params }) => {
    const session = await auth().catch(() => null);
    const userId = session?.user?.id ?? null;
    const { postId } = await params;

   
    let posts = await prisma.post.findFirst({
        where: {
            id: postId
        },
        include: {
            user: {
                select: {
                    name: true,
                    id: true,
                    username: true,
                    xp: true,
                    avatar: true

                }
            },
            game: {
                select: {
                    name: true,
                    id: true
                }
            },
            Like: userId
                ? { where: { userId } }
                : false

        }
    });

    if (!posts) {
        return;
    }

    const post = ({
        id: posts.id,
        description: posts.description,
        likeCount: posts.likeCount,
        commentCount: posts.commentCount,
        hasLiked: userId ? posts.Like.length > 0 : false,
        user: posts.user,
        game: posts.game,
        createdAt: posts.createdAt,
        mediaUrls: posts.mediaUrls,
        userId: posts.userId,
    })

    function extractKeywords(text: string) {
        return text
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 5);
    }

    const keywords = extractKeywords(post.description);

    const relatedPosts = await prisma.post.findMany({
        where: {
            AND: [
                { id: { not: post.id } },
                {
                    OR: keywords.map(word => ({
                        description: { contains: word, mode: "insensitive" }
                    }))
                }
            ]
        },
        include: {
            user: {
                select: {
                    name: true,
                    username: true,
                    id: true
                }
            }
        },
        take: 5,
        orderBy: { createdAt: "desc" }
    });

    let bookmark = false;

    if (session?.user?.id) {
        bookmark = !!(await prisma.bookmark.findFirst({
            where: {
                userId: session.user.id,
                postId
            }
        }));
    }

    const gameCount = await prisma.myGame.count({
        where: {
            userId: post?.userId
        }
    })

    const postCount = await prisma.post.count({
        where: {
            userId: post?.userId
        }
    });

    const collectionCount = await prisma.collection.count({
        where: {
            userId: post?.userId
        }
    })

    const comment = await prisma.comment.findMany({
        take: 2,
        where: { postId, parentId: null },
        include: {
            user: { select: { id: true, name: true, username: true, avatar: true } },
            _count: { select: { replies: true } },
            CommentReaction: {
                where: { userId: session?.user.id }
            }
        },
        orderBy: { createdAt: 'asc' },
    })

    let following = false;

    if (userId) {
        following = !!await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session!.user.id,
                    followingId: post.user.id
                }
            }
        })
    }



    const comments = comment.map((item) => ({
        id: item.id,
        postId: item.postId,
        content: item.content,
        user: item.user,
        userId: item.userId,
        createdAt: item.createdAt,
        hasLiked: item.CommentReaction.length > 0,
        likeCount: item.likeCount,
        parentId: item.parentId,
        _count: { replies: item._count.replies },


    }))


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-purple-500/20 bg-black/40 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <a href="/community" className="flex items-center space-x-2 rounded-lg px-4 py-2 transition hover:bg-white/10">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Community</span>
                    </a>
                    <PostActions postId={post.id} bookmark={bookmark} />
                </div>
            </header>

            <div className="mx-auto max-w-7xl md:px-6 md:py-8 py-2 px-2">
                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="col-span-12 space-y-3 lg:col-span-8">
                        {/* Post Card */}
                        <div className="rounded-2xl border border-purple-500/20 bg-white/5 md:p-8 p-2 backdrop-blur-lg">
                            {/* Post Header */}
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link href={`/player-profile/${post.user.id}`} key={post.user.id}>
                                        {
                                            post.user.avatar ?
                                                <div className=' h-12 w-12 rounded-full'>
                                                    <img src={post.user.avatar} alt="" className='rounded-full' />
                                                </div>
                                                :
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl">
                                                    <img className='w-8 h-8' src="https://img.icons8.com/?size=100&id=7rcs0z3sdioE&format=png&color=000000" alt="" />
                                                </div>

                                        }
                                    </Link>
                                    <div className=''>
                                        <p className="text-xl font-bold">{post?.user?.username || post.user.name}</p>
                                        <div className="flex md:flex-row flex-col items-center space-x-3 text-sm text-gray-400">
                                            {
                                                post.game &&
                                                <div className='self-start'>
                                                    <span className="text-purple-400">{post.game?.name}</span>
                                                    <span className='md:visible hidden'>•</span>
                                                </div>
                                            }
                                            <span className="flex items-center space-x-1 self-start">
                                                <Clock className="h-3 w-3" />
                                                {/* @ts-ignore */}
                                                <span > {getTimeAgoFormatted(post.createdAt)}</span>
                                            </span>
                                            {/* <span className="flex items-center space-x-1">
                                                <Eye className="h-3 w-3" />
                                                <span>{post.views} views</span>
                                            </span> */}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Post Content */}
                            <div className="mb-6">
                                <PostDescription text={post.description} />
                            </div>

                            {/* Post Image */}
                            {post.mediaUrls.length > 0 && (
                                <PostImages mediaUrls={post.mediaUrls} />

                            )}

                            {/* Tags */}
                            {/* <div className="mb-6 flex flex-wrap gap-2">
                                {post.tags.map((tag, idx) => (
                                    <span key={idx} className="cursor-pointer rounded-full bg-purple-500/20 px-4 py-1 text-sm text-purple-300 transition hover:bg-purple-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div> */}

                            {/* Post Actions */}
                            <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                <div className="flex items-center space-x-6">
                                    <LikeButton
                                        postId={post.id}
                                        hasLiked={post.hasLiked}
                                        likeCount={post.likeCount}
                                    />
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <MessageCircle className="h-6 w-6" />
                                        <span className="text-lg font-semibold">{post.commentCount}</span>
                                    </div>
                                </div>
                                <CopyButton />
                            </div>
                        </div>

                        {/* Comments Section */}
                        <CommentSection postId={post.id} initialComments={comments} />
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-12 space-y-6 lg:col-span-4">
                        <AuthorCard name={post.user.name} authorId={post.user.id} gameCount={gameCount} postCount={postCount} collectionCount={collectionCount} following={following} xp={post.user.xp} profilePicture={post?.user?.avatar} username={post.user.username} userId={session?.user.id} />

                        {/* related posts */}
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

                        {/* report */}
                        {/* <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-lg">
                            <div className="mb-3 flex items-center space-x-2 text-red-400">
                                <Flag className="h-5 w-5" />
                                <h3 className="font-bold">Report Post</h3>
                            </div>
                            <p className="mb-4 text-sm text-gray-400">
                                If this post violates community guidelines, please report it.
                            </p>
                            <button className="w-full rounded-lg border border-red-500/40 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10">
                                Report
                            </button>
                        </div>  */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostDetails