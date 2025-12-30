'use client'
import { useEffect } from 'react'
import { Post } from '@/app/types/post'
import { useProfileBookmarkStore } from '@/zustland/profileBookmarkStore'

export default function InitProfileBookmarkPosts({ posts }: { posts: Post[] }) {
  const setPosts = useProfileBookmarkStore((s) => s.setPosts)

  useEffect(() => {
    setPosts(posts)
  }, [posts, setPosts])

  return null
}
