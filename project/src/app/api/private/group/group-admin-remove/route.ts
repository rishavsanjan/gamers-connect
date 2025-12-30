import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { groupId, memberId } = await req.json();

        const isMember = await prisma.groupMember.findFirst({
            where: {
                groupId,
                userId: memberId,
            }
        })

        if (!isMember) {
            return NextResponse.json({ message: "Not a member" })
        }

        const alreadyAdmin = await prisma.groupMember.findFirst({
            where: {
                groupId,
                userId: memberId,
                role: 'ADMIN'
            }
        })

        if (!alreadyAdmin) {
            return NextResponse.json({ message: "User is not an admin" })
        }

        const admin = await prisma.groupMember.update({
            where: {
                userId_groupId: {
                    userId: memberId,
                    groupId
                }
            },
            data: {
                role: 'MEMBER'
            }
        })

        return NextResponse.json({ admin })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
