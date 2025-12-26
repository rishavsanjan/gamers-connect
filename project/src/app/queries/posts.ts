import axios from 'axios'
import { Post } from '../types/post'
import { Game } from '@prisma/client'

export interface PostsResponse {
    posts: Post[]
    nextPage?: number
}

interface MediaResponse {
    media: Array<{
        id: string,
        mediaUrls: string[]
    }>,
    nextPage?: number

}

interface Member {
    name: string | null
    username: string
    id: string
    avatar: string | null
    role?: 'admin' | 'member'
}

interface MemberResponse {
    users: Member[]
    nextPage?: number
}

interface GameResposne {
    games: Game[],
    nextPage?: number
}




export const fetchHomePosts = async ({
    pageParam = 1,
    queryKey,
}: {
    pageParam?: number
    queryKey: string[]
}): Promise<PostsResponse> => {
    const [, filter, category] = queryKey

    const res = await axios.post<PostsResponse>(
        `/api/getposts?page=${pageParam}`,
        { filter, category }
    )

    return {
        posts: res.data.posts,
        nextPage: res.data.posts.length > 0 ? pageParam + 1 : undefined,
    }
}


export const fetchGroupPosts = async ({
    pageParam = 1,
    queryKey
}: {
    pageParam?: number,
    queryKey: string[]
}): Promise<PostsResponse> => {
    const [, groupId, filter, category] = queryKey;

    const res = await axios.post<PostsResponse>(
        `/api/get-group-posts?page=${pageParam}`,
        { groupId, filter, category }
    )

    return {
        posts: res.data.posts,
        nextPage: res.data.posts.length > 0 ? pageParam + 1 : undefined,
    }
}

export const fetchBookmarkedPosts = async ({
    pageParam = 1,
    queryKey
}: {
    pageParam?: number,
    queryKey: string[]
}): Promise<PostsResponse> => {

    const res = await axios.get<PostsResponse>(
        `/api/private/getbookmarks?page=${pageParam}`
    )

    return {
        posts: res.data.posts,
        nextPage: res.data.posts.length > 0 ? pageParam + 1 : undefined,
    }
}

export const fetchOwnPosts = async ({
    pageParam = 1,
    queryKey
}: {
    pageParam?: number,
    queryKey: string[]
}): Promise<PostsResponse> => {
    const [, userId] = queryKey;
    const res = await axios.post<PostsResponse>(
        `/api/profile/profile-posts?page=${pageParam}`,
        { userId }
    )

    return {
        posts: res.data.posts,
        nextPage: res.data.posts.length > 0 ? pageParam + 1 : undefined,
    }
}


export const fetchHashTagPosts = async ({
    pageParam = 1,
    queryKey
}: {
    pageParam?: number,
    queryKey: string[]
}): Promise<PostsResponse> => {
    const [, filter, category, tag] = queryKey;
    const res = await axios.post<PostsResponse>(
        `/api/hash-tag-posts?tag=${encodeURIComponent(tag)}&page=${pageParam}`,
        { filter, category, tag }
    )

    return {
        posts: res.data.posts,
        nextPage: res.data.posts.length > 0 ? pageParam + 1 : undefined,
    }
}

export const fetchGroupMembers = async ({
    pageParam = 1,
    queryKey
}: {
    pageParam?: number,
    queryKey: string[]
}): Promise<MemberResponse> => {
    const [, groupId] = queryKey;
    const res = await axios.post<MemberResponse>(
        `/api/get-group-members?page=${pageParam}`,
        { groupId }
    )

    return {
        users: res.data.users,
        nextPage: res.data.users.length > 0 ? pageParam + 1 : undefined,
    }
}

export const fetchGroupMedia = async ({
    pageParam = 1,
    queryKey
}: {
    pageParam?: number,
    queryKey: string[]
}): Promise<MediaResponse> => {
    const [, groupId] = queryKey;
    const res = await axios.post<MediaResponse>(
        `/api/get-group-media?page=${pageParam}`,
        { groupId }
    )

    return {
        media: res.data.media,
        nextPage: res.data.media.length > 0 ? pageParam + 1 : undefined,
    }
}

export const fetchProfileGames = async ({ pageParam = 1, queryKey }: { pageParam?: number, queryKey: string[] }): Promise<GameResposne> => {
   
    const [, gameTab] = queryKey;
    const res = await axios.get<GameResposne>(
        `/api/private/fetchgames?page=${pageParam}&tab=${gameTab}`,
    )

    console.log(res.data)

    return {
        games: res.data.games,
        nextPage: res.data.games.length > 0 ? pageParam + 1 : undefined
    }
}



