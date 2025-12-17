
import React, { useState } from 'react';
import { User, Gamepad2, Users, Bell, Settings, Power, Trash2, Check, Shield, Swords, Timer, BarChart3, UserPlus, Cross, CrossIcon } from 'lucide-react';
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma';
import { GoX } from 'react-icons/go';


export default async function PendingRequestsPage() {
    const session = await auth().catch(() => null);

    let activeRequests = await prisma.followRequest.findMany({
        where: {
            receiverId: session?.user.id
        },
        select: {
            sender: {
                select: {
                    id: true,
                    avatar: true,
                    username: true,
                    name: true,
                    xp: true
                }
            },
            createdAt: true
        }
    })

    const requests = activeRequests.map(f => f.sender)

    
    return (
        <div className="bg-[#131022] text-white font-sans antialiased h-screen flex overflow-hidden">


            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
                        {/* Page Header */}
                        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/60">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                                    Pending Requests
                                </h1>
                                <p className="text-[#9b92c9] text-lg font-normal max-w-xl">
                                    Manage your incoming friend requests, clan invites, and game challenges.
                                </p>
                            </div>
                            <button className="flex shrink-0 items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[#292348] hover:bg-[#38315e] text-white text-sm font-bold transition-colors">
                                <Trash2 size={18} />
                                <span className="truncate">Decline All</span>
                            </button>
                        </header>



                        {/* Requests List */}
                        <div className="flex flex-col gap-4">
                            {requests.map((request) => (
                                <div
                                    key={request.id}
                                    className={`group flex flex-col sm:flex-row gap-4 bg-[#1a172e] p-5 rounded-2xl shadow-sm border border-slate-800/50 hover:border-[#3713ec]/50 transition-all  : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-5 flex-1">
                                        {/* Avatar */}
                                        <div className="relative h-[72px] w-[72px] shrink-0">
                                            <div className="w-full h-full rounded-2xl overflow-hidden">
                                                <img
                                                    src={request.avatar}
                                                    alt={request.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-[#1a172e]`}>
                                                <UserPlus size={14} />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col justify-center gap-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-white text-lg font-bold leading-tight">
                                                    {request.name}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20`}>
                                                    {request.xp} XP
                                                </span>
                                            </div>
                                            <p className="text-[#9b92c9] text-sm font-medium">
                                                Follow Request
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">


                                                2 hours ago
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 sm:self-center shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                        <button className="flex-1 sm:flex-none h-10 px-4 rounded-lg border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                            <GoX size={18}/>
                                            Decline
                                        </button>
                                        <button className="flex-1 sm:flex-none h-10 px-6 rounded-lg bg-[#3713ec] hover:bg-[#3713ec]/90 text-white font-bold text-sm shadow-lg shadow-[#3713ec]/20 transition-all flex items-center justify-center gap-2">
                                            <Check size={18} />
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}