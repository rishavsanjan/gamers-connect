import { create } from 'zustand'
import { Post } from '@/app/types/post'
import { PostActions } from '@/store/PostActions'

interface ProfilePostsState extends PostActions {
    posts: Post[]
    setPosts: (posts: Post[]) => void
}

export const useProfilePostsStore = create<ProfilePostsState>((set) => ({
    posts: [],

    setPosts: (posts) => set({ posts }),

    updatePost: (id, data) =>
        set((state) => ({
            posts: state.posts.map((p) =>
                p.id === id ? { ...p, ...data } : p
            ),
        })),

    toggleBookmark: (id) =>
        set((state) => ({
            posts: state.posts.map((p) =>
                p.id === id ? { ...p, hasBookmarked: !p.hasBookmarked } : p
            ),
        })),

    deletePost: (id) =>
        set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
        })),
}))
