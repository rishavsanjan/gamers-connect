'use client';
import { handleAddFollow, handleAddRequest } from '@/app/queries/requests';
import { useLoginModal } from '@/context/LoginModalContext';
import { useUser } from '@/context/UserContext';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

export default function AuthorCard({ name, authorId, gameCount, postCount, collectionCount, following, xp, profilePicture, username, userId, privacy, isRequestSent }: { name: string | null; authorId: string; gameCount: number; postCount: number; collectionCount: number, following: boolean, xp: number, profilePicture: string | null, username: string, userId: string | undefined, privacy: 'PRIVATE' | 'PUBLIC', isRequestSent: boolean }) {
    const { isLoggedIn, user } = useUser();
    const { openLoginModal } = useLoginModal();

    const { data: session, status } = useSession()
    const [isFollowing, setIsFollowing] = useState(following);
    const [requestSent, setRequestSent] = useState(isRequestSent);

    console.log(following, isRequestSent)

    const addFollowMutation = useMutation({
        mutationFn: async () => {
            if (!session) throw new Error('Not logged in!');
            handleAddFollow({ followerId: session.user.id, followingId: authorId })
        },
        onMutate: async () => {
            if (!isLoggedIn) {
                openLoginModal();
                throw new Error("Not logged in");
            }

            const previous = isFollowing;
            setIsFollowing(prev => !prev);

            return { previous }
        },
        onError: (_err, _vars, context) => {
            setIsFollowing(context?.previous || (prev => !prev))
        },
    })

    const followRequestMutation = useMutation({
        mutationFn: async () => {
            if (!session) throw new Error('Not logged in!');
            handleAddRequest({ senderId: session?.user.id, receiverId: authorId })
        },
        onMutate: async () => {
            if (!isLoggedIn) {
                openLoginModal();
                throw new Error("Not logged in");
            }

            const previous = requestSent;
            setRequestSent(prev => !prev);

            return { previous }
        },
        onError: (_err, _vars, context) => {
            setRequestSent(context?.previous || (prev => !prev))
        },
    })


    return (
        <div className="rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur-lg">
            <div className="mb-4 flex items-center space-x-4">
                <Link href={`/player-profile/${authorId}`} key={authorId}>
                    {
                        profilePicture ?
                            <div className=' h-12 w-12 rounded-full'>
                                <img src={profilePicture} alt="" className='rounded-full' />
                            </div>
                            :
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl">
                                <img className='w-8 h-8' src="https://img.icons8.com/?size=100&id=7rcs0z3sdioE&format=png&color=000000" alt="" />
                            </div>

                    }
                </Link>
                <div className="flex-1">
                    <div className='flex flex-row  items-center gap-2'>
                        <p className="text-lg font-bold">{username || name}</p>
                        {
                            privacy === 'PRIVATE' &&
                            <FaLock color='white' />
                        }

                    </div>

                    <p className="text-sm text-gray-400">{xp} XP</p>
                </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-4 border-y border-white/10 py-4">
                <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">{postCount}</p>
                    <p className="text-xs text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">{gameCount}</p>
                    <p className="text-xs text-gray-400">Games</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">{collectionCount}</p>
                    <p className="text-xs text-gray-400">Collections</p>
                </div>
            </div>
            {
                userId === authorId ?
                    <Link
                        className={`w-full self-center flex flex-row justify-center rounded-lg py-3 font-semibold transition border border-purple-500 bg-transparent hover:bg-purple-500/10`}
                        href={'/profile'}>
                        My Profile
                    </Link>
                    :
                    <button
                        onClick={() => { privacy === 'PUBLIC' ? addFollowMutation.mutate() : followRequestMutation.mutate() }}
                        disabled={addFollowMutation.isPending || userId === authorId}
                        className={`w-full rounded-lg py-3 font-semibold transition ${isFollowing || requestSent
                            ? 'border border-purple-500 bg-transparent hover:bg-purple-500/10'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                            } disabled:cursor-not-allowed cursor-pointer`}
                    >
                        {
                            addFollowMutation.isPending ?
                                <ClipLoader color='white' size={20} />
                                :
                                <>
                                    {
                                        isFollowing
                                            ? 'Following'
                                            :
                                            <>
                                                {
                                                    privacy === 'PRIVATE' ?
                                                        <>
                                                            {
                                                                requestSent ? 'Requested' : 'Request'
                                                            }
                                                        </>
                                                        :

                                                        <>
                                                            Follow
                                                        </>

                                                }
                                            </>

                                    }
                                </>

                        }


                    </button>
            }

        </div>
    );
}