'use client'
import { addToMyGames, addToPlayList, removeFromMyGame, removeFromPlayList } from "@/app/utils/game_functions"
import { Game } from "@/app/types/game"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { FadeLoader } from "react-spinners"
import { IoGameController } from "react-icons/io5"
import { LuGamepad2 } from "react-icons/lu"
import RatingSlider from "./RatingSlider"
import { FcRating, FcRatings } from "react-icons/fc"
import CollectionModal from "./CollectionModal"
import { BiFolder } from "react-icons/bi"

interface AddMyGameButtonProps {
    game: Game
}

interface gameStatus {
    inMyGames: boolean,
    inPlaylist: boolean,
    rated: {
        user_rating: number
    } | null,
}



export const AddMyGameButton: React.FC<AddMyGameButtonProps> = ({ game }) => {
    const [status, setStatus] = useState<gameStatus>({
        inMyGames: false,
        inPlaylist: false,
        rated: null,
    });
    const [loading, setLoading] = useState(false);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [collectionModal, setCollectionModal] = useState(false);
    const collectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            const res = await axios.get(`/api/private/checkGameStatus?igdb_id=${game.id}`);
            setStatus(res.data);
        };
        fetchStatus();
    }, [game]);

    useEffect(() => {
        if (collectionModal) {
            // Lock scroll
            document.body.style.overflow = "hidden";

            const handleCollectionClose = (e: MouseEvent) => {
                if (e.target === collectionRef.current) {
                    setCollectionModal(false);
                }
            };

            const container = collectionRef.current;
            container?.addEventListener("mousedown", handleCollectionClose);

            return () => {
                // Cleanup
                document.body.style.overflow = "auto";
                container?.removeEventListener("mousedown", handleCollectionClose);
            };
        } else {
            document.body.style.overflow = "auto";
        }
    }, [collectionModal]);


    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <button
                        onClick={() => {
                            status.inMyGames ? removeFromMyGame(game, 'myGame', setStatus, setLoading) : addToMyGames(game, 'myGame', setStatus, setLoading)
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
                            status.inPlaylist ? removeFromPlayList(game, 'playlist', setStatus, setPlaylistLoading) : addToPlayList(game, 'playlist', setStatus, setPlaylistLoading)
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
                    <button
                        onClick={() => { setCollectionModal(true) }}
                        className='bg-transparent hover:bg-gray-50/10 ease-in-out duration-300 cursor-pointer rounded-xl p-2   flex flex-row justify-between items-center gap-3 border border-white '>
                        <div className="flex flex-col items-start">
                            <p>Save to</p>
                            <p>Collection</p>
                        </div>

                        <BiFolder size={35} />
                    </button>

                </div>
                <div className='self-start w-96'>
                    {
                        status.rated ?
                            <div className="items-center border border-gray-200/50 self-center p-2 px-6 rounded-xl flex flex-col  w-fit bg-gray-200/20">
                                <p className="text-2xl text-green-400 font-medium">{status.rated.user_rating}</p>
                                <p className="text-xl font-bold ">Rated</p>
                            </div>
                            :
                            <RatingSlider ratingStatus={status.rated} game={game} setStatus={setStatus} />

                    }


                </div>
            </div>
            {
                collectionModal &&
                <div
                    ref={collectionRef}
                    className="h-screen w-full  fixed top-0 left-0 bg-black/50 z-[100] items-center justify-center flex flex-col gap-4">
                    <CollectionModal game={game} />
                </div>
            }
        </>


    )

}