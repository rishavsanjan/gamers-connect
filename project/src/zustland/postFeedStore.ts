import { create } from 'zustand'
import { Post } from '@/app/types/post'

interface PostFeedState {
    posts: Post[]
    setPosts: (posts: Post[]) => void
    updatePost: (id: string, data: Partial<Post>) => void
    toggleBookmark: (id: string) => void
    deletePost: (id: string) => void
    reset : () => void
}

export const usePostFeedStore = create<PostFeedState>((set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
    updatePost: (id, data) =>
        set((state) => ({
            posts: state.posts.map((post) =>
                post.id === id ? { ...post, ...data } : post
            ),
        })),

    toggleBookmark: (id) =>
        set((state) => ({
            posts: state.posts.map((post) =>
                post.id === id
                    ? { ...post, hasBookmarked: !post.hasBookmarked }
                    : post
            ),
        })),

    deletePost: (id) =>
        set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
        })),

    reset: () => set({ posts: [] })


}))