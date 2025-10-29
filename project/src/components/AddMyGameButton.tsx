'use client'
import { addToMyGames, addToPlayList, removeFromMyGame, removeFromPlayList } from "@/app/utils/game_functions"
import { Game } from "@/app/types/game"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { FadeLoader } from "react-spinners"
import { IoGameController } from "react-icons/io5"
import { LuGamepad2 } from "react-icons/lu"
import RatingSlider from "./RatingSlider"
import CollectionModal from "./CollectionModal"
import { BiFolder } from "react-icons/bi"
import { TiTick } from "react-icons/ti"
import { GoCheck } from "react-icons/go";

interface AddMyGameButtonProps {
    game: Game
}

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



export const AddMyGameButton: React.FC<AddMyGameButtonProps> = ({ game }) => {
    const [status, setStatus] = useState<gameStatus>({
        inMyGames: null,
        inPlaylist: false,
        rated: null,
    });
    const [showPlatformModal, setShowPlatformModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [ownGame, setOwnedGame] = useState({
        owned_platform: '',
        status: ''
    })
    const [loading, setLoading] = useState(false);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [collectionModal, setCollectionModal] = useState(false);
    const collectionRef = useRef<HTMLDivElement>(null);
    const platforms = [
        'WINDOWS', 'PLAYSTATION', 'XBOX', 'NINTENDO',
        'MAC', 'LINUX', 'IOS', 'ANDROID', 'ARCADE', 'WII'
    ];

    const gameStatuses = ['NOT_STARTED', 'PLAYING', 'COMPLETED', 'ABANDONED'];

    useEffect(() => {
        const fetchStatus = async () => {
            const res = await axios.get(`/api/private/checkGameStatus?igdb_id=${game.id}`);
            setStatus(res.data);
        };
        fetchStatus();
    }, [game]);
    console.log(status)
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

    console.log(ownGame.status)
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <button
                        onClick={() => {
                            status.inMyGames ? removeFromMyGame(game, 'myGame', setStatus, setLoading) : setShowPlatformModal(true)
                        }}
                        className={`${status.inMyGames ? 'bg-green-500' : 'bg-white'}  rounded-xl p-1 gap-4  flex flex-row  px-8 items-center hover:bg-red-300 hover:backdrop-blur-2xl hover:shadow-2xl transition-all ease-in-out duration-300 cursor-pointer`}>
                        {
                            loading ?
                                <FadeLoader color="gray" />
                                :
                                <>
                                    <div>
                                        {
                                            status.inMyGames ?
                                                <>
                                                    <p className='text-white text-lg'>Owned</p>
                                                    <p className="text-gray-200">{status.inMyGames.owned_platform}</p>
                                                    <p className="text-gray-200">{status.inMyGames.status}</p>
                                                </>

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
                                                <GoCheck color="white" size={40} />
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
            {showPlatformModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm  ">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Select Platform</h3>
                        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto ">
                            {platforms.map((platform) => (
                                <button
                                    onClick={() => {
                                        setOwnedGame(prev => ({ ...prev, owned_platform: platform }))
                                        setShowPlatformModal(false);
                                        setShowStatusModal(true);
                                    }}
                                    key={platform}
                                    className="bg-gray-700 hover:bg-purple-600 text-white py-3 px-4 rounded-xl transition-all duration-300 font-semibold hover:scale-105"
                                >
                                    {platform}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowPlatformModal(false)}
                            className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Game Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-green-500 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Game Status</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {gameStatuses.map((gameStatus) => (
                                <button
                                    onClick={() => {
                                        setOwnedGame(prev => ({ ...prev, status: gameStatus }));
                                        setShowStatusModal(false);
                                        addToMyGames(game, 'myGame', setStatus, setLoading, ownGame.owned_platform, gameStatus)
                                    }}
                                    key={gameStatus}
                                    className="bg-gray-700 hover:bg-green-600 text-white py-4 px-6 rounded-xl transition-all duration-300 font-semibold hover:scale-105 text-left"
                                >
                                    {gameStatus.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowStatusModal(false)}
                            className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        </>


    )

}