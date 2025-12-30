'use client'
import { useEffect } from 'react'
import { Post } from '@/app/types/post'
import { useProfileBookmarkStore } from '@/zustland/profileBookmarkStore'
import { useGroupPostsStore } from '@/zustland/groupPostsStore'

export default function InitGroupPostsStore({ posts }: { posts: Post[] }) {
  const setPosts = useGroupPostsStore((s) => s.setPosts)

  useEffect(() => {
    setPosts(posts)
  }, [posts, setPosts])

  return null
}
