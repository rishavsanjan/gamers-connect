'use client'
import { useEffect } from 'react'
import { Post } from '@/app/types/post'
import { useProfilePostsStore } from '@/zustland/profilePostsStore'

export default function InitProfilePosts({ posts }: { posts: Post[] }) {
  const setPosts = useProfilePostsStore((s) => s.setPosts)

  useEffect(() => {
    setPosts(posts)
  }, [posts, setPosts])

  return null
}
