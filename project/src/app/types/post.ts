import { Hashtag, User } from "@prisma/client"
import { Game } from "./game"

export interface Post {
    id: string,
    description: string,
    userId: string,
    type: string,
    gameId: string | null,
    mediaUrls: string[],
    createdAt: Date,
    updatedAt: Date,
    user: {
        id: string,
        name: string | null,
        username:string
    }
    game: {
        name: string | null
        igdb_id: number
    } | null
    tags?: Hashtag
    likeCount: number
    commentCount: number
    hasLiked: boolean
    group?:{
        name:string,
        id:string
    } | null
}

export interface HashTag {
    id: string,
    name: string,
    _count: { posts: number }
}