import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { invitedPersons, groupId } = await req.json();
        const isAdmin = await prisma.groupMember.count({
            where: {
                userId: session.user.id,
                groupId,
                OR: [{
                    role: 'ADMIN'
                },
                {
                    role: 'OWNER'
                }
                ]
            }
        }) > 0 ? true : false;

        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }


        await prisma.groupInvites.createMany({
            data: invitedPersons.map((userId: string) => ({
                userId,
                groupId,
                invitedById: session.user.id,
            })),
            skipDuplicates: true
        })



        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
