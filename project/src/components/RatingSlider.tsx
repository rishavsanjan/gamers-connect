"use client";
import { addRating } from "@/app/utils/game_functions";
import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";
import { Game } from "@/app/types/game";
import { FadeLoader } from "react-spinners";

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

interface RatingModelProps {
    ratingStatus: {
        user_rating: number
    } | null,
    game: Game,
    setStatus: React.Dispatch<React.SetStateAction<gameStatus>>
}

const RatingSlider: React.FC<RatingModelProps> = ({ ratingStatus, game, setStatus }) => {
    const [value, setValue] = useState([0]);
    const [ratingLoading, setRatingLoading] = useState(false)
    return (
        <div className="flex flex-row items-center gap-2 p-2 bg-transparent backdrop-blur-xl rounded-2xl border border-gray-200/20 text-white w-full mx-auto">
            <h2 className="text-lg font-semibold">Rate</h2>

            <Slider.Root
                className="relative flex items-center w-full h-5"
                value={value}
                onValueChange={setValue}
                max={100}
                step={1}
            >
                <Slider.Track className="bg-gray-700 relative flex-grow rounded-full h-1.5">
                    <Slider.Range className="absolute bg-purple-500 h-full rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-purple-500 rounded-full shadow-lg cursor-pointer hover:bg-purple-600 transition " />
            </Slider.Root>

            <p className="text-xl font-bold">{value[0]} / 100</p>

            <button
                onClick={() => { addRating(game, 'rating', setStatus, setRatingLoading, value[0]) }}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-semibold transition cursor-pointer"
            >
                {
                    !ratingLoading ?
                        'Submit'
                        :
                        <FadeLoader color="purple" />

                }

            </button>
        </div>
    );
};

export default RatingSlider;
