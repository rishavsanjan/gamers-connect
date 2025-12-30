'use client'
import { useEffect } from 'react'
import { Post } from '@/app/types/post'
import { usePostFeedStore } from '@/zustland/postFeedStore'

export default function InitPosts({ posts }: { posts: Post[] }) {
  const setPosts = usePostFeedStore((s) => s.setPosts)

  useEffect(() => {
    setPosts(posts)
  }, [posts, setPosts])

  return null
}
