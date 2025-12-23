

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma';
import Tabs from './Tabs';


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

    const activeInvites = await prisma.groupInvites.findMany({
        where: {
            userId: session?.user.id,
        },
        select: {
            group: {
                select: {
                    id: true,
                    name: true,
                    coverImage: true
                }
            }
            , createdAt: true
        },

    });

    const invites = activeInvites.map((req) => ({
        ...req.group,
        createdAt: req.createdAt
    }))

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
                        <Tabs requests={requests} invites={invites} />
                    </div>
                </div>
            </main>
        </div>
    );
}