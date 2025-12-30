// app/api/private/getreplies/route.ts
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
        const isMember = await prisma.groupMember.findFirst({
            where: {
                userId: session.user.id,
                groupId
            }
        })

        if (!isMember) {
            return NextResponse.json({ message: "Not a member" })
        }
        const isAdmin = await prisma.groupMember.count({
            where: {
                groupId: groupId,
                userId: session.user.id,
                role: 'ADMIN'
            }
        }) > 0 ? true : false;

        const result = await prisma.$transaction(async (tx) => {
            const join = await tx.groupMember.delete({
                where: {
                    userId_groupId: {
                        userId: session.user.id,
                        groupId
                    }
                }
            })

            await tx.group.update({
                where: {
                    id: groupId
                },
                data: {
                    memberCount: {
                        decrement: 1
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
