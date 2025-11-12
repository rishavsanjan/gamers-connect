
'use client'
import React, { useEffect, useState } from 'react'
import { Game } from '../types/game'

interface Props {
    game: Game
}

export function TimeLeft({ game }: Props) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })

    const imgUrl = game.cover?.url
        ? `https:${game.cover.url.replace('t_thumb', 't_screenshot_med')}`
        : '/placeholder.jpg'

    // Live countdown
    useEffect(() => {
        const updateCountdown = () => {
            const releaseDate = game.first_release_date * 1000
            const now = Date.now()
            let diff = releaseDate - now

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 })
                return
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            setTimeLeft({ days, hours, minutes })
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 60000) 
        return () => clearInterval(interval)
    }, [game.first_release_date])

    const pad = (num: number) => String(num).padStart(2, '0')

    const formattedDate = new Date(game.first_release_date * 1000).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="relative overflow-hidden rounded-sm shadow-xl">
            {/* Background Image */}
            <img
                src={imgUrl}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover brightness-75 hover:brightness-100"
            />

            {/* Overlay */}
            <div className="relative z-10 flex flex-col items-center text-center text-white px-4 py-8 sm:px-6 sm:py-12 bg-black/40 hover:bg-black/0">
                <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold">{game.name}</h2>
                <p className="text-base sm:text-lg text-purple-200 mt-1">{formattedDate}</p>

                {/* Countdown */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
                    {/* Days */}
                    <div className="flex flex-col items-center">
                        <span className="text-3xl sm:text-4xl xl:text-6xl font-mono font-bold">
                            {pad(timeLeft.days)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-300 tracking-widest">DAYS</span>
                    </div>

                    <span className="text-2xl sm:text-4xl text-gray-400">|</span>

                    {/* Hours */}
                    <div className="flex flex-col items-center">
                        <span className="text-3xl sm:text-4xl xl:text-6xl font-mono font-bold">
                            {pad(timeLeft.hours)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-300 tracking-widest">HOURS</span>
                    </div>

                    <span className="text-2xl sm:text-4xl text-gray-400">|</span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                        <span className="text-3xl sm:text-4xl xl:text-6xl font-mono font-bold">
                            {pad(timeLeft.minutes)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-300 tracking-widest">MINUTES</span>
                    </div>
                </div>
            </div>
        </div>
    )
}