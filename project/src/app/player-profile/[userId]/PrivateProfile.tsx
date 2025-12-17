import React, { useState } from 'react';
import { Lock, Star, UserPlus, Search, Bell, X } from 'lucide-react';
import { prisma } from '@/lib/db';
import PrivateFollowButton from './PrivateFollowButton';

interface Props {
    receiverId: string
    senderId: string | undefined
}

export default async function PrivateProfile({ senderId, receiverId }: Props) {
    console.log(senderId, receiverId)
    const isPrivate = true;
    const isRequestSent =
        (await prisma.followRequest.count({
            where: { senderId, receiverId },
        })) > 0 ? true : false;

    const d = await prisma.followRequest.findFirst({
        where:{
            senderId,
            receiverId
        }
    })

    console.log(d)

    console.log(isRequestSent)

    return (
        <div className="min-h-screen bg-black text-gray-100">


            {/* Main Content */}
            <main className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 mx-auto">
                <div className="flex flex-col items-center w-full">
                    {/* Profile Picture with Lock Overlay */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-black overflow-hidden shadow-2xl">
                            <img
                                alt="rishavsanjan avatar"
                                className="w-full h-full object-cover filter brightness-75"
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=rishav"
                            />
                            {isPrivate && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Lock className="text-white/80 text-3xl" size={48} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Username and Follow Button */}
                    <div className="mt-6 flex items-center gap-4">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                            rishavsanjan
                        </h1>
                        <PrivateFollowButton receiverId={receiverId} isRequestSent={isRequestSent} />
                    </div>

                    {/* XP Badge */}
                    <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-gray-900 border border-white/5 shadow-sm">
                        <Star size={14} className="text-yellow-600 fill-yellow-600 mr-2" />
                        <span className="text-yellow-600/70 font-bold font-mono mr-1">
                            {isPrivate ? '---' : '330'}
                        </span>
                        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                            XP
                        </span>
                    </div>

                    {/* Private Account Notice */}
                    {isPrivate && (
                        <div className="mt-12 w-full max-w-2xl bg-gray-900 border border-white/5 rounded-xl p-8 text-center shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-700/50 to-transparent"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Lock className="text-gray-400" size={32} />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">
                                    This Account is Private
                                </h2>
                                <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                                    Follow this account to see their bio, gaming stats, playlist, and collection.
                                    Your follow request will need to be approved by @rishavsanjan.
                                </p>
                            </div>
                        </div>
                    )}


                </div>

                {/* Blurred Content Section */}
                <div className={`mt-16 w-full ${isPrivate ? 'opacity-30 select-none pointer-events-none filter blur-[2px]' : ''}`}>
                    {/* Bio Section */}
                    <div className="mb-4">
                        <div className="h-6 w-12 bg-gray-700 rounded mb-4"></div>
                        <div className="w-full p-4 bg-gray-900 rounded-lg border border-white/5 h-20"></div>
                    </div>


                </div>
            </main>


        </div>
    );
}