import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupId, userId, response } = await req.json();

        const result = await prisma.$transaction(async (tx) => {

            if (response === 'accept') {
                await tx.group.update({
                    where: {
                        id: groupId
                    },
                    data: {
                        members: {
                            connect: { id: session.user.id }
                        },
                        memberCount: {
                            increment: 1
                        }
                    }
                })
            }

            await tx.groupInvites.delete({
                where: {
                    userId_groupId: {
                        userId: session.user.id,
                        groupId
                    }
                }
            })
        })

        await prisma.groupInvites.create({
            data: {
                userId,
                groupId,
                invitedById: session.user.id
            }
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}