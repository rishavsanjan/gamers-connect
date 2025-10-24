'use client'
import axios from "axios"
import { Game } from "../types/game"

interface gameStatus {
    inMyGames: boolean,
    inPlaylist: boolean,
    rated: boolean,
}



export const addToMyGames = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setPlaylistLoading: React.Dispatch<React.SetStateAction<boolean>>) => {

    if (model === 'myGame') {
        setLoading(true)
    } else if (model === 'playlist') {
        setPlaylistLoading(true)
    }
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
        if (model === 'myGame') {
            setStatus(prev => ({ ...prev, inMyGames: true }))
        } else if (model === 'playlist') {
            setStatus(prev => ({ ...prev, inPlaylist: true }))
        }
    }
    setLoading(false)
    setPlaylistLoading(false)

    console.log(response.data)
}

export const removeFromMyGame = async (game: Game, model: string, setStatus: React.Dispatch<React.SetStateAction<gameStatus>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setPlaylistLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (model === 'myGame') {
        setLoading(true)
    } else if (model === 'playlist') {
        setPlaylistLoading(true)
    }
    const response = await axios({
        url: '/api/private/removegame',
        method: 'post',
        data: {
            igdb_id: game.id,
            model
        }
    })

    if (response.data.success) {
        if (model === 'myGame') {
            setStatus(prev => ({ ...prev, inMyGames: false }))
        } else if (model === 'playlist') {
            setStatus(prev => ({ ...prev, inPlaylist: false }))
        }
    }
    setLoading(false)
    setPlaylistLoading(false)


    console.log(response.data)
}

