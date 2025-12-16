"use client"
import { Post } from "@/app/types/post";
import { createContext, useContext, useState } from "react";

interface PostFeedContextType {
    posts: Post[];
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    updatePost: (id: string, data: Partial<Post>) => void;
    toggleBookamrk: (id: string) => void;
    deletePost: (id: string) => void;
}

const PostFeedContext = createContext<PostFeedContextType | null>(null);

export function PostFeedProvider({ initialPosts, children }: any) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    const updatePost = (id: string, data: Partial<Post>) => {
        setPosts(prev =>
            prev.map(post =>
                post.id === id ? { ...post, ...data } : post
            )
        );
    };

    const toggleBookamrk = (id: string) => {
        setPosts(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, hasBookmarked: !item.hasBookmarked }
                    : item
            )
        );
    }

    const deletePost = (id: string) => {
        setPosts(prev => prev.filter(post => post.id !== id));
    }

    return (
        <PostFeedContext.Provider value={{ posts, setPosts, updatePost, toggleBookamrk, deletePost }}>
            {children}
        </PostFeedContext.Provider>
    );
}

export const usePostFeed = () => {
    const ctx = useContext(PostFeedContext);
    if (!ctx) throw new Error("usePostFeed must be used inside PostFeedProvider");
    return ctx;
};
