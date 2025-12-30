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
        const result = await prisma.$transaction(async (tx) => {

        })
        const isOwner = await prisma.group.findFirst({
            where: {
                id: groupId,
                ownerId: session.user.id,
            },
        });

        if (!isOwner) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }
        
        await prisma.$transaction(async (tx) => {
            tx.group.delete({
                where: { id: groupId },
            });

            tx.groupMember.deleteMany({
                where: {
                    groupId
                }
            })

            tx.groupInvites.deleteMany({
                where: {
                    groupId
                }
            })
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
