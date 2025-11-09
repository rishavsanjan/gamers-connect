
export interface Comment {
    id: string
    content: string
    userId: string
    postId: string
    user: {
        id: string,
        name: string | null
        username: string
    }
    hasLiked: boolean
    createdAt: Date
    likeCount: number
    replies?: Comment[],
    _count: {
        replies: number
    }
}