import { Hashtag, User } from "@prisma/client"
import { Game } from "./game"

export interface Post {
    id: string,
    description: string,
    userId: string,
    type: string,
    gameId: string,
    mediaUrls: string[],
    createdAt: Date,
    updatedAt: Date,
    user: User
    game: Game
    tags: Hashtag
    likeCount: number
    commentCount: number
}

export interface HashTag {
    id: string,
    name: string,
    _count: { posts: number }
}