import { anticipatedGames, getCollections, getFranchises, getUpcomingEvents } from '@/lib/igdb';
import React from 'react'
import { TimeLeft } from './TimeLeft';
import { Game } from '../types/game';

const AnticipatedGames = async () => {
    const games = await anticipatedGames();
    // const events = await getUpcomingEvents();
    // const franchises = await getFranchises();
    // const collections = await getCollections();
    // console.log(collections);

    return (
        <div>
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
    )
}

export default AnticipatedGames