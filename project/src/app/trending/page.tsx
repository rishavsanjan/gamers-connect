import { anticipatedGames, getUpcomingEvents } from '@/lib/igdb'
import React from 'react'
import { Game } from '../types/game'
import { TimeLeft } from './TimeLeft'

export default async function Trending() {
    const games = await anticipatedGames();
    const events = await getUpcomingEvents();
    console.log(events)

    console.log(games)
    return (
        <div className='mb-12 sm:mb-16 md:mb-20'>
            <div className='px-4 py-8 sm:px-8 sm:py-12 md:p-16 lg:p-20'>
                <span className='text-2xl sm:text-3xl border-b-4 border-purple-500'>Most anticipated</span>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8'>
                    {
                        games.map((game: Game) => {
                            return (
                                <TimeLeft key={game.id} game={game} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}