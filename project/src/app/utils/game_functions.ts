'use client'
import axios from "axios"
import { Game } from "../types/game"

interface gameStatus {
    inMyGames: boolean,
    inPlaylist: boolean,
    rated: {
        user_rating: number
    } | null,
}



export const addToMyGames = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {

    setLoading(true)

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

    if (response.data.success) {
        setStatus(prev => ({ ...prev, inMyGames: true }))
    }
    setLoading(false)

    console.log(response.data)
}

export const removeFromMyGame = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true)

    const response = await axios({
        url: '/api/private/removegame',
        method: 'post',
        data: {
            igdb_id: game.id,
            model
        }
    })

    if (response.data.success) {
        setStatus(prev => ({ ...prev, inMyGames: false }))

    }
    setLoading(false)


    console.log(response.data)
}


export const addToPlayList = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setPlaylistLoading: React.Dispatch<React.SetStateAction<boolean>>) => {

    setPlaylistLoading(true)
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

    if (response.data.success) {
        setStatus(prev => ({ ...prev, inPlaylist: true }))
    }
    setPlaylistLoading(false)

    console.log(response.data)
}


export const removeFromPlayList = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setPlaylistLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setPlaylistLoading(true)
    const response = await axios({
        url: '/api/private/removegame',
        method: 'post',
        data: {
            igdb_id: game.id,
            model
        }
    })

    if (response.data.success) {
        setStatus(prev => ({ ...prev, inPlaylist: false }))
    }
    setPlaylistLoading(false)


    console.log(response.data)
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

    console.log(response.data)
}

