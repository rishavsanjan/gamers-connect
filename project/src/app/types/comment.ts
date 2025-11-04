
export interface Comment {
    id: string
    content: string
    userId: string
    postId:string
    user: {
        id:string,
        name:string | null
    }
    hasLiked : boolean
    createdAt: Date
    likeCount:number
}