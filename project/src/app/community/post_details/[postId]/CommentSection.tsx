'use client'
import CommentItem from './CommentItem'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Comment } from '@/app/types/comment'
import { Send } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { useUser } from '@/context/UserContext'
import { useLoginModal } from '@/context/LoginModalContext'
import CommentSkeleton from '@/skeleton/CommentSkeleton'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rollbackPostFeeds, snapshotAllPostFeeds, updatePostInAllFeeds } from '@/app/queries/postCacheHelpers'
import { Post } from '@/app/types/post'
import { fetchComments } from '@/app/queries/posts'
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll'

export default function CommentSection({ postId, initialComments }: { postId: string, initialComments: Comment[] }) {
  const { isLoggedIn } = useUser();
  const { openLoginModal } = useLoginModal();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['comment', postId],
    queryFn: fetchComments,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 30
  });

  useEffect(() => {
    if (!data) return

    const allComments: Comment[] = data.pages.flatMap(c => c.comments);
    setComments(allComments)
  }, [data]);

  const lastPostRef = useInfiniteScroll(isFetchingNextPage, hasNextPage ?? false, fetchNextPage);



  function addReply(comments: Comment[], parentId: string, newReply: Comment): Comment[] {

    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies ?? []), newReply],
        }
      }

      if (comment.replies) {
        return {
          ...comment,
          replies: addReply(comment.replies, parentId, newReply),
        }
      }

      return comment
    })
  }

  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async (parentId: string | null) => {
      const res = await axios.post('/api/private/addcomment', {
        postId,
        content: commentText,
        parentId,
      })

      const newComment = res.data.comment


      return { parentId, newComment }
    },

    onMutate: async () => {
      await queryClient.cancelQueries();

      const snapshots = snapshotAllPostFeeds(queryClient);

      queryClient.setQueryData(['post', postId], (old: Post) =>
        old
          ? {
            ...old,
            commentCount: old.commentCount + 1,
          }
          : old
      )

      updatePostInAllFeeds(queryClient, postId, (post: Post) => ({
        ...post,
        commentCount: post.commentCount + 1
      }))

      return { snapshots }
    },
    onSuccess: ({ parentId, newComment }) => {
      if (parentId) {
        setComments(prev => addReply(prev, parentId, newComment))
      } else {
        setComments(prev => [newComment, ...prev])
      }
      setCommentText('')
    },

    onError: (_err, _vars, context) => {
      rollbackPostFeeds(queryClient, context?.snapshots);
    },
  })


  const handleAddComment = async (parentId: string | null, content: string) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    addCommentMutation.mutate(parentId);

  }

  return (
    <div>
      {/* Add Comment */}
      <div className="mb-8 rounded-xl border border-purple-500/20 bg-white/5 p-4">
        <textarea

          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Share your thoughts..."
          className="mb-4 h-24 w-full resize-none rounded-lg border border-purple-500/20 bg-white/10 px-4 py-3 outline-none transition focus:border-purple-500/60 placeholder:text-gray-300"
        />
        <button
          onClick={() => { handleAddComment(null, commentText) }}
          disabled={addCommentMutation.isPending || commentText.trim().length === 0}
          className="ml-auto flex items-center space-x-2 rounded-lg bg-gradient-to-r disabled:cursor-not-allowed from-purple-600 to-pink-600 px-6 py-2 font-semibold transition hover:from-purple-700 hover:to-pink-700"
        >
          {
            addCommentMutation.isPending ?
              <ClipLoader color='white' size={25} />
              :
              <>
                <Send className="h-4 w-4" />
                <span>Comment</span>
              </>
          }

        </button>
      </div>
      {comments.map(c => (
        <CommentItem key={c.id} comment={c} postId={postId} onReply={handleAddComment} />
      ))}
      {
        isFetchingNextPage &&
        <CommentSkeleton count={2} />
      }
      <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center ">

        {!hasNextPage && <p className="text-gray-500">No more comments</p>}
      </div>
    </div>
  )
}
