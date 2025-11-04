import { Post } from "../types/post";
import axios from "axios";




export async function handleLike(postId: string, setPosts: React.Dispatch<React.SetStateAction<Post[]>>) {
    const response = await axios({
        url: `/api/private/addorremovereaction`,
        method: 'post',
        data: {
            postId
        }
    })

    setPosts(prev => prev.map((post) => {
        if (post.id === postId) {
            return {
                ...post,
                hasLiked: true,
                likeCount: post.likeCount + 1
            }
        }
        return post;
    }))
};


export async function handleRemoveLike(postId: string, setPosts: React.Dispatch<React.SetStateAction<Post[]>>) {
    const response = await axios({
        url: `/api/private/addorremovereaction`,
        method: 'post',
        data: {
            postId
        }
    })

    setPosts(prev => prev.map((post) => {
        if (post.id === postId) {
            return {
                ...post,
                hasLiked: false,
                likeCount: post.likeCount - 1
            }
        }
        return post;
    }))
};