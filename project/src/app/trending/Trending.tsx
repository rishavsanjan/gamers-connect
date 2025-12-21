'use client'
import GamesList from '@/components/GamesList';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Game } from '../types/game';
import GameListScroll from '@/components/GameListScroll';

const Trending = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [page, setPage] = useState(0);

    const getGames = async () => {
        const response = await axios({
            url: `/api/igdb/fetchgames`,
            method: 'post',
            data: {
                page,
                category: 'thisweek'
            }
        })
        setGames(response.data)
    }

    useEffect(() => {
        getGames();
    }, [page])


    return (
        <div >
            <span className='text-2xl sm:text-3xl border-b-4 border-purple-500 '>Popular right now</span>

            <GameListScroll  gamesList={games} />
        </div>
    )
}

export default Trending