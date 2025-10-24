'use client'
import { addToMyGames, removeFromMyGame } from "@/app/utils/game_functions"
import { Game } from "@/app/types/game"
import { useEffect, useState } from "react"
import axios from "axios"
import { FadeLoader } from "react-spinners"
import { IoGameController } from "react-icons/io5"
import { LuGamepad2 } from "react-icons/lu"
interface AddMyGameButtonProps {
    game: Game
}




export const AddMyGameButton: React.FC<AddMyGameButtonProps> = ({ game }) => {
    const [status, setStatus] = useState({
        inMyGames: false,
        inPlaylist: false,
        rated: false,
    });
    const [loading, setLoading] = useState(false);
    const [playlistLoading, setPlaylistLoading] = useState(false)

    useEffect(() => {
        const fetchStatus = async () => {
            const res = await axios.get(`/api/private/checkGameStatus?igdb_id=${game.id}`);
            setStatus(res.data);
        };
        fetchStatus();
    }, [game]);
    console.log(status)

    return (
        <div className="flex flex-row gap-4">
            <button
                onClick={() => {
                    status.inMyGames ? removeFromMyGame(game, 'myGame', setStatus, setLoading, setPlaylistLoading) : addToMyGames(game, 'myGame', setStatus, setLoading, setPlaylistLoading)
                }}
                className='bg-white rounded-xl p-1 gap-4  flex flex-row  px-8 items-center hover:bg-gray-300 hover:backdrop-blur-2xl hover:shadow-2xl transition-all ease-in-out duration-300 cursor-pointer'>
                {
                    loading ?
                        <FadeLoader color="gray" />
                        :
                        <>
                            <div>
                                {
                                    status.inMyGames ?
                                        <p className='text-black text-lg'>Owned</p>
                                        :

                                        <>
                                            <p className='text-gray-400 text-left text-sm'>Add to</p>
                                            <p className='text-black text-lg'>My Games</p>
                                        </>
                                }
                            </div>
                            <div>
                                {
                                    status.inMyGames ?
                                        <img className='w-12 h-12' src="https://img.icons8.com/?size=100&id=a4l6bA9mSmBh&format=png&color=40C057" alt="" />
                                        :
                                        <>
                                            <img className='w-12 h-12' src="https://img.icons8.com/?size=100&id=102544&format=png&color=000000" alt="" />

                                        </>
                                }
                            </div>

                        </>
                }



            </button>
            <button
                onClick={() => {
                    status.inPlaylist ? removeFromMyGame(game, 'playlist', setStatus, setLoading, setPlaylistLoading) : addToMyGames(game, 'playlist', setStatus, setLoading, setPlaylistLoading)
                }}
                className='bg-transparent hover:bg-gray-50/10 ease-in-out duration-300 cursor-pointer rounded-xl p-2 gap-4  flex flex-row justify-between items-center border border-white '>
                {
                    playlistLoading ?
                        <FadeLoader color="gray" />
                        :
                        <>
                            {
                                status.inPlaylist ?

                                    <div>
                                        <p className='text-white '>In Playlist</p>
                                    </div>
                                    :
                                    <div >
                                        <p className='text-gray-400 text-left'>Add to</p>
                                        <p className='text-white '>Playlist</p>
                                    </div>

                            }

                            {
                                status.inPlaylist ?

                                    <div>
                                        <LuGamepad2 className='text-2xl text-purple-500' />
                                    </div>
                                    :
                                    <div>
                                        <IoGameController className='text-3xl' />
                                    </div>

                            }



                        </>

                }

            </button>
        </div>

    )

}