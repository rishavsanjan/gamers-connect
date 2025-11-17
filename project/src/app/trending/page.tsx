import React from 'react'
import AnticipatedGames from './AnticipatedGames'
import Trending from './Trending'

export default function TrendingSection() {

    return (
        <div className='mb-12 sm:mb-16 md:mb-20'>
            <div className='px-4 py-8 sm:px-8 sm:py-12 md:p-16 lg:p-20'>
                <Trending />
                <AnticipatedGames />
            </div>
        </div>
    )
}