'use client'
import CommentItem from './CommentItem'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Comment } from '@/app/types/comment'
import { Send } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { useUser } from '@/context/UserContext'
import { useLoginModal } from '@/context/LoginModalContext'

export default function CommentSection({ postId, initialComments }: { postId: string, initialComments: Comment[] }) {
  const { isLoggedIn } = useUser();
  const { openLoginModal } = useLoginModal();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [commentUploading, setCommentUploading] = useState(false);
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })

    if (node) observer.current.observe(node)
  }, []);


  const getComments = async () => {
    const response = await axios({
      url: `/api/getcomment?page=${page}`,
      method: 'post',
      data: {
        postId
      }
    });
    const newComments = response.data.comments;
    setComments(prev => [...prev, ...newComments]);
    if (newComments.length === 0) setHasMore(false);
    setLoading(false);

  }


  useEffect(() => {
    if (page === 1) return;
    setLoading(true);
    getComments();


  }, [page, hasMore])

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


  const handleAddComment = async (parentId: string | null, content: string) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    console.log(parentId);
    if (!parentId) {
      setCommentUploading(true)
    }
    const res = await axios.post('/api/private/addcomment', {
      postId,
      content,
      parentId,
    })
    const newComment = res.data.comment

    if (parentId) {
      setComments(prev => addReply(prev, parentId, newComment))

    } else {
      setComments(prev => [...prev, newComment])
    }
    setCommentUploading(false)
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
          disabled={commentUploading}
          className="ml-auto flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 font-semibold transition hover:from-purple-700 hover:to-pink-700"
        >
          {
            commentUploading ?
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
      <div ref={lastPostRef} className="h-10 mt-10 flex flex-col justify-center items-center">
        {loading && <ClipLoader color='white' size={40} />}
        {!hasMore && <p className="text-gray-500">No more comments</p>}
      </div>
    </div>
  )
}
