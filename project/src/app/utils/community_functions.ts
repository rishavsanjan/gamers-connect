import { SetStateAction } from "react";
import { Post } from "../types/post";
import axios from "axios";
import { auth } from "@/auth";
import { GroupsExtended } from "../types/groups";






export async function handleLike(postId: string, setPosts?: React.Dispatch<React.SetStateAction<Post[]>>) {
    const response = await axios({
        url: `/api/private/addorremovereaction`,
        method: 'post',
        data: {
            postId
        }
    });

    console.log(response.data)

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

interface FollowingProps {
    otherPersonId: string
    myId: string | undefined
}


export const addFollow = async ({ otherPersonId, myId }: FollowingProps) => {

    const response = await axios({
        url: `/api/private/addfollow`,
        method: 'post',
        data: {
            followerId: myId,
            followingId: otherPersonId
        }
    })
}

interface GroupLeaveProps {
    groupId: string,
    setGroupsState?: React.Dispatch<React.SetStateAction<GroupsExtended[]>>,
}

export const handleGroupLeave = async ({ groupId, setGroupsState }: GroupLeaveProps) => {
    try {
        const response = await axios({
            url: `/api/private/group/group-leave`,
            method: 'post',
            data: {
                groupId
            }
        })
        if (setGroupsState) {
            setGroupsState(prev =>
                prev.map((group) => {
                    if (group.id === groupId) {
                        return {
                            ...group,
                            hasJoined: false
                        }
                    }
                    return group;
                })
            )
        }

        console.log(response.data)

    } catch (error) {
        console.log(error)
    }
}

interface GroupJoinProps {
    groupId: string,
    setGroupsState?: React.Dispatch<React.SetStateAction<GroupsExtended[]>>,
}

export const handleGroupJoin = async ({ groupId, setGroupsState }: GroupJoinProps) => {
    try {
        const response = await axios({
            url: `/api/private/group/group-join`,
            method: 'post',
            data: {
                groupId
            }
        })

        if (setGroupsState) {
            setGroupsState(prev =>
                prev.map((group) => {
                    if (group.id === groupId) {
                        return {
                            ...group,
                            hasJoined: true
                        }
                    }
                    return group;
                })
            )
        }

    } catch (error) {
        console.log(error)
    }
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

