import React, { Dispatch, useEffect, useState } from 'react';
import { X, Share2, Check } from 'lucide-react';
import axios from 'axios';
import { Game } from '@/app/types/game';

interface Props {
    shareAsPost: boolean,
    type: string
    gameId: number
    setShareAsPost: Dispatch<React.SetStateAction<boolean>>
    gameName?: string
    status?: string

}

const ShareAsPost: React.FC<Props> = ({ shareAsPost, type, gameId, setShareAsPost, gameName, status }) => {



    const [game, setGame] = useState<Game | null>(null);

    const [isSharing, setIsSharing] = useState(false);
    const [visibility, setVisibility] = useState(false);
    const [uplading, setUploading] = useState(false)

    useEffect(() => {
        const selectedGameData = async () => {
            const response = await axios({
                url: `/api/private/gamedetails`,
                method: 'post',
                data: {
                    id: gameId
                }
            })

            setGame(response.data.game);
        }
        selectedGameData();
    }, []);

    const getDefaultMessage = () => {
        if (type === 'collection') {
            return `Just created a new collection on Gamely! Check it out! 🎮`;
        } else if (type === 'myGame') {
            if (status === 'NOT_STARTED') {
                return `Thinking of playing ${gameName}! How is the game?`;
            } else if (status === 'COMPLETED') {
                return `Just completed ${gameName}🎯`;
            } else if (status === 'ABANDONED') {
                return `Abandoned playing ${gameName} `;
            } else {
                return `Playing ${gameName}! Share your experience.`;
            }

        } else if (type === 'addToCollection') {
            return `Added $ to my "$" collection! 📚`;
        }
        return '';
    };

    const [message, setMessage] = useState(getDefaultMessage());

    const handleCreatePost = async () => {
        setUploading(true)

        const extractHashtags = (text: string): string[] => {
            const matches = text.match(/#\w+/g);
            return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
        };

        const hashtags = extractHashtags(message);

        let uploadedUrls: string[] = [];


        const response = await axios({
            url: `/api/private/createpost`,
            method: 'post',
            data: {
                description: message,
                name: game?.name,
                igdb_id: game?.id,
                summary: game?.summary,
                storyline: game?.storyline,
                first_release_date: game?.first_release_date,
                total_rating: game?.total_rating,
                cover: game?.cover,
                game_type: game?.game_type.type,
                genres: game?.genres,
                platforms: game?.platforms,
                type: 'GENERAL',
                tags: hashtags,
                mediaUrls: uploadedUrls,
                visibility: visibility ? 'EVERYONE' : 'ONLY_FOLLOWERS',
            }
        });
        
        setTimeout(() => {
            setUploading(false);
            setShareAsPost(false);
        }, 500);

    }

    console.log(game)

    if (!shareAsPost) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-70 flex items-center justify-center z-100 p-4 ">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-md w-full shadow-2xl border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Share Your Achievement</h2>
                    </div>
                    <button
                        className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-300 text-sm">
                        {type === 'collection' && 'Share your new collection with the community!'}
                        {type === 'completed' && 'Let everyone know about your achievement!'}
                        {type === 'addToCollection' && 'Show off your growing collection!'}
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Your Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all resize-none"

                            placeholder="Write your message..."
                        />
                        <p className="text-xs text-slate-400 mt-2">
                            {message.length} / 280 characters
                        </p>
                    </div>
                </div>

                <div className='flex flex-col mb-4'>
                    <div className='flex flex-row justify-between items-center w-full px-6 '>
                        <span className=''>{visibility ? 'Share to everyone' : 'Share only to followers'}</span>
                        <div
                            onClick={() => { setVisibility(prev => !prev) }}
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition 
                         ${visibility ? "bg-purple-600" : "bg-gray-400"}`}
                        >
                            <div
                                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition 
                        ${visibility ? "translate-x-6" : ""}`}
                            >

                            </div>

                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-slate-700">
                    <button
                        onClick={() => { setShareAsPost(false) }}
                        className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleCreatePost}
                        disabled={isSharing || message.trim().length === 0}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSharing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Sharing...
                            </>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4" />
                                Share Now
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareAsPost