import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const session = await auth();
        const { query, groupId } = await req.json();

        if (!session) {
            return NextResponse.json({ msg: 'Unauthorized' }, { status: 200 })
        }

        const alreadyInvited = await prisma.groupInvites.findMany({
            where: {
                groupId
            },
            select: {
                userId: true
            }
        });

        const userIds = alreadyInvited.map(item => item.userId)

        console.log(userIds);

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: "insensitive" } },
                    { name: { contains: query, mode: "insensitive" } },

                ],

                NOT: {
                    OR: [
                        { id: session.user.id },

                        {
                            groupInvites: {
                                some: {
                                    groupId,
                                },
                            },
                        },
                        {
                            groupMembers: {
                                some: {
                                    id: groupId,
                                },
                            },
                        },
                    ],
                },
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true
            }, take: 5
        })

        return NextResponse.json({ users }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
