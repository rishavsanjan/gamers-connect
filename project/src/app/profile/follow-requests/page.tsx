
import React, { useState } from 'react';
import { User, Gamepad2, Users, Bell, Settings, Power, Trash2, Check, Shield, Swords, Timer, BarChart3, UserPlus, Cross, CrossIcon } from 'lucide-react';
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma';
import { GoX } from 'react-icons/go';
import { timeAgo } from '@/app/utils/date';
import AcceptDeclineButton from './AcceptDeclineButton';
import InfiniteRequests from './InfiniteRequests';


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
    });

    const requests = activeRequests.map((req) => ({
        ...req.sender,
        createdAt: req.createdAt,
    }));


    return (
        <div className="bg-[#131022] text-white font-sans antialiased h-screen flex overflow-hidden">


            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">

                        {/* Requests List */}
                        <InfiniteRequests requests={requests} />

                    </div>
                </div>
            </main>
        </div>
    );
}