'use client'
import axios from "axios"
import { Game } from "../types/game"

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





export const addToMyGames = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, owned_platform: string, status: string) => {
    setLoading(true)
    setStatus((prev) => ({
        ...prev, inMyGames: {
            status: status,
            owned_platform: owned_platform
        }
    }))
    try {
        const response = await axios({
            url: '/api/private/addgame',
            method: 'post',
            data: {
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
                model,
                owned_platform,
                status

            }
        })


    } catch (error) {
        setStatus(prev => ({ ...prev, inMyGames: null }));
        console.log(error)
    } finally {
        setLoading(false)
    }



}

export const removeFromMyGame = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, status: gameStatus) => {
    setLoading(true)
    const oldStatus = status.inMyGames;
    setStatus(prev => ({ ...prev, inMyGames: null }))

    try {
        const response = await axios({
            url: '/api/private/removegame',
            method: 'post',
            data: {
                igdb_id: game.id,
                model
            }
        })

    } catch (error) {
        setStatus(prev => ({ ...prev, inMyGames: oldStatus }))
        console.log(error);
    } finally {
        setLoading(false);
    }






}


export const addToPlayList = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setPlaylistLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setPlaylistLoading(true)
    setStatus(prev => ({ ...prev, inPlaylist: true }))
    try {
        const response = await axios({
            url: '/api/private/addgame',
            method: 'post',
            data: {
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
                model
            }
        })
    } catch (error) {
        setStatus(prev => ({ ...prev, inPlaylist: false }))

        console.log(error)
    } finally {
        setPlaylistLoading(false)
    }





}


export const removeFromPlayList = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setPlaylistLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setPlaylistLoading(true)
    setStatus(prev => ({ ...prev, inPlaylist: false }))
    try {
        const response = await axios({
            url: '/api/private/removegame',
            method: 'post',
            data: {
                igdb_id: game.id,
                model
            }
        })
    } catch (error) {
        setStatus(prev => ({ ...prev, inPlaylist: true }))
        console.log(error)
    } finally {
        setPlaylistLoading(false)
    }
}

export const addRating = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setRatingLoading: React.Dispatch<React.SetStateAction<boolean>>, user_rating: number) => {

    setRatingLoading(true)
    const response = await axios({
        url: '/api/private/addgame',
        method: 'post',
        data: {
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
            model,
            user_rating
        }
    })

    if (response.data.success) {
        setStatus(prev => ({ ...prev, rated: { user_rating: user_rating } }))
    }
    setRatingLoading(false)

}

export function pickPlatformColor(name: string): string {
    const colors: Record<string, string> = {
        WINDOWS: "#3b82f6",
        Nintendo: "#00000",
        IOS: "#60a5fa",
        Android: "#84cc16",
        PLAYSTATION: "#ef4444",
        "Apple Macintosh": "#e5e5e5",

    };
    return colors[name] || "#9ca3af"; // default gray if not found
}


