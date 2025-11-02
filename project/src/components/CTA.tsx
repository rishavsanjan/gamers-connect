'use client'
import React, { useEffect, useRef, useState } from 'react'
import SideBar from './SideBar'
import GamesList from './GamesList'
import axios from 'axios'
import { ClipLoader, FadeLoader } from 'react-spinners'

export default function CTA() {
    const [games, setGames] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [category, setCategory] = useState('trending')
    const [genreCategory, setGenreCategory] = useState(0);
    const [selectedGenreId, setSelectedGenreId] = useState(0);

    const observerRef = useRef<HTMLDivElement | null>(null)

    const fetchGames = async (pageNum: number, cat: string, genreId?: number) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/igdb/fetchgames`, {
                page: pageNum,
                category: cat,
                genreId: genreId || null,
            });

            const newGames = response.data;
            setGames((prev) => [...prev, ...newGames]);
            if (newGames.length < 10) setHasMore(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (loading || !hasMore) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1)
                }
            },
            { threshold: 1.0 }
        )
        if (observerRef.current) observer.observe(observerRef.current)
        return () => observer.disconnect()
    }, [loading, hasMore])

    useEffect(() => {
        if (genreCategory) {
            fetchGames(page, category, Number(genreCategory));
        } else {
            fetchGames(page, category);
        }
    }, [page, category, genreCategory]);


    const handleCategoryChange = (newCategory: string) => {
        if (newCategory === category) return
        setCategory(newCategory)
        setGenreCategory(0)
        setPage(1)
        setGames([])
        setHasMore(true)
    }

    const handleGenreChange = (selectedGenreId: number) => {

        setGenreCategory(selectedGenreId)
        setCategory('')
        setPage(1)
        setGames([])
        setHasMore(true)
    }
    console.log(games)

    return (
        <div className="flex flex-row ">
            <div className="w-[15%]">
                <SideBar
                    selectedCategory={category}
                    onCategoryChange={handleCategoryChange}
                    onGenreChange={handleGenreChange}
                />
            </div>
            <div className="p-4 overflow-visible w-[85%] flex flex-col">
                <h1 className="text-5xl font-bold px-4 py-6 capitalize">
                    {category === 'top250' && 'Top 250'}
                    {category === 'thisweek' && 'This Week'}
                    {category === 'last30days' && 'Last 30 Days'}
                    {category === 'nextweek' && 'Next Week'}
                    {category === 'trending' && 'Trending'}
                    {genreCategory === 5 && 'Shooter Games'}
                    {genreCategory === 12 && 'Role-Playing Games'}
                    {genreCategory === 31 && 'Adventure Games'}
                    {genreCategory === 10 && 'Racing Games'}
                    {genreCategory === 13 && 'Simulator Games'}
                    {genreCategory === 32 && 'Indie Games'}
                    {genreCategory === 33 && 'Arcade Games'}
                    {genreCategory === 9 && 'Puzzle Games'}
                </h1>
                <span className='px-4'>
                    {genreCategory === 5 && 'Shooter games focus on ranged combat, where players use firearms or projectile weapons to defeat enemies. They test precision, reflexes, and tactical movement. Subgenres include first-person shooters (FPS) like Call of Duty and third-person shooters like Fortnite or Gears of War.'}
                    {genreCategory === 12 && 'RPGs let players assume the role of a character in a richly detailed world. These games emphasize storytelling, exploration, and character progression, often featuring quests, dialogue choices, and leveling systems. Examples include The Witcher 3, Final Fantasy, and Elden Ring.'}
                    {genreCategory === 31 && 'Adventure games focus on story, exploration, and puzzle-solving rather than fast-paced action. Players uncover narratives, solve mysteries, and interact with characters and environments. Classics include Life is Strange, The Legend of Zelda, and Monkey Island.'}
                    {genreCategory === 10 && 'Racing games simulate competitive driving experiences — from realistic racing simulators like Gran Turismo to high-octane arcade titles like Need for Speed. They test speed, timing, and control, often offering a wide range of vehicles and tracks.'}
                    {genreCategory === 13 && "Simulation games aim to replicate real-world activities as closely as possible, whether it's flying planes, farming crops, or running cities. Titles like The Sims, Microsoft Flight Simulator, and Farming Simulator let players experience everyday or specialized scenarios with detail and realism."}
                    {genreCategory === 32 && 'Indie games are typically created by small or independent studios, focusing on innovation, storytelling, or unique gameplay mechanics rather than big budgets. They often push creative boundaries — examples include Hades, Hollow Knight, and Celeste.'}
                    {genreCategory === 33 && 'Arcade games emphasize quick, accessible fun with simple mechanics and high replayability. Originally designed for arcade machines, these games focus on reflexes, timing, and scoring. Think of Pac-Man, Street Fighter II, or Geometry Dash.'}
                    {genreCategory === 9 && 'Puzzle games challenge the player’s logic, pattern recognition, and problem-solving skills. They range from relaxing experiences like Tetris and Candy Crush to complex brain-teasers like Portal or The Witness.'}
                </span>
                <GamesList gamesList={games} />
                {loading &&
                    <div className='self-center'>
                        <ClipLoader color='white' />
                    </div>}
                {!hasMore && <p className="text-center text-gray-500">No more games</p>}
                <div ref={observerRef} className="h-1" />
            </div>
        </div>
    )
}
