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



        // const result = await prisma.$transaction(async (tx) => {
        //     await tx.commentReaction.deleteMany({
        //         where: {
        //             comment: {
        //                 post: {
        //                     groupId
        //                 }
        //             }
        //         }
        //     })

        //     await tx.comment.deleteMany({
        //         where: {
        //             post: {
        //                 groupId
        //             }
        //         }
        //     })

        //     await tx.post.deleteMany({
        //         where: {
        //             groupId
        //         }
        //     })

        //     await tx.group.delete({
        //         where: {
        //             id: groupId
        //         }
        //     })
        // })

        await prisma.group.delete({
            where: { id: groupId },
        });



        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
