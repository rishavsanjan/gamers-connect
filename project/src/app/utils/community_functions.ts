import { Post } from "../types/post";
import axios from "axios";




export async function handleLike(postId: string, setPosts?: React.Dispatch<React.SetStateAction<Post[]>>) {
    const response = await axios({
        url: `/api/private/addorremovereaction`,
        method: 'post',
        data: {
            postId
        }
    })

    if (setPosts) {
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
    }

};


export async function handleRemoveLike(postId: string, setPosts?: React.Dispatch<React.SetStateAction<Post[]>>) {
    const response = await axios({
        url: `/api/private/addorremovereaction`,
        method: 'post',
        data: {
            postId
        }
    })

    if (setPosts) {
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
    }

};

export function buildCommentTree(comments: any[]) {
    const map: Record<string, any> = {};
    const roots: any[] = [];

    // Build map of comments
    comments.forEach(comment => {
        map[comment.id] = { ...comment, replies: [] };
    });

    // Build tree
    comments.forEach(comment => {
        if (comment.parentId) {
            map[comment.parentId]?.replies.push(map[comment.id]);
        } else {
            roots.push(map[comment.id]);
        }
    });

    return roots;
}
