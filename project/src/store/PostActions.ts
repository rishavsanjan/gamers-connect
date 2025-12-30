import { Post } from '@/app/types/post'

export interface PostActions {
  updatePost: (id: string, data: Partial<Post>) => void
  toggleBookmark: (id: string) => void
  deletePost: (id: string) => void
}
