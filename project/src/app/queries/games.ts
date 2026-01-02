import axios from "axios"
import { Game } from "../types/game"

interface Collection {
    id: string,
    name: string,
    description: string,
    hasGame: boolean
}

interface CollectionResponse {
    collections: Collection[]
}

interface gameStatus {
    inMyGames: {
        status: string,
        owned_platform: string
    } | null,
    inPlaylist: boolean,
    rated: {
        user_rating: number
    } | null,
}

interface GameStatusResponse {
    gameStatus: gameStatus
}


export const fetchCollections = async ({
    queryKey,
}: {
    queryKey: [string, number | undefined]

}): Promise<CollectionResponse> => {
    const [, gameId] = queryKey

    const res = await axios.get<CollectionResponse>(
        `/api/private/getcollection?gameId=${gameId}`)

    return {
        collections: res.data.collections
    }
}

export const createCollection = async ({
    name,
    description
}: {
    name: string, description: string

}) => {

    const res = await axios.post(
        `/api/private/createcollection`, { name, description })

    return res.data.collection;
}


export const addGameToCollection = async ({
    gameId,
    collectionId,
    game,
}: {
    gameId: number
    collectionId: string
    game: Game
}) => {
    const res = await axios.post(
        `/api/private/addgameincollection?gameId=${gameId}`,
        {
            name: game.name,
            igdb_id: game.id,
            summary: game.summary,
            storyline: game.storyline,
            first_release_date: game.first_release_date,
            total_rating: game.total_rating,
            cover: game.cover,
            game_type: game.game_type.type,
            genres: game.genres,
            platforms: game.platforms,
            collectionId,
        }
    )

    return res.data
}

export const checkGameStatus = async ({
    queryKey,
}: {
    queryKey: [string, number | undefined]

}) => {
    const [, gameId] = queryKey

    const res = await axios.get(
        `/api/private/getcollection?gameId=${gameId}`)

    return res.data;
}

