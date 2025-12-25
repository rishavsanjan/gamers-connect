import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { groupId } = await req.json();

        const isMember = await prisma.group.findFirst({
            where: {
                id: groupId,
                members: { some: { id: session.user.id } }
            }
        })

        if (isMember) {

            await prisma.group.update({
                where: {
                    id: groupId,

                },
                data: {
                    members: {
                        disconnect: {
                            id: session.user.id
                        }
                    },
                    memberCount: {
                        decrement: 1
                    }
                }
            })

            return NextResponse.json({ success: true }, { status: 200 })
        }

        const result = await prisma.$transaction(async (tx) => {

            const join = await tx.group.update({
                where: {
                    id: groupId
                },
                data: {
                    members: {
                        connect: { id: session.user.id }
                    },
                    memberCount: { increment: 1 }

                }
            })


            await tx.groupInvites.delete({
                where: {
                    userId_groupId: {
                        userId: session.user.id,
                        groupId
                    }
                }
            })

            return join;
        })



        return NextResponse.json({ result })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
