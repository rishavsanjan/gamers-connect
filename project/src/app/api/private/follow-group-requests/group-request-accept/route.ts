import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, groupId } = await req.json();

        await prisma.$transaction(async (tx) => {
            await tx.groupJoinRequest.findUniqueOrThrow({
                where: {
                    userId_groupId: {
                        userId, groupId
                    }
                }
            })

            await tx.groupMember.create({
                data: {
                    userId,
                    groupId,
                    role:'MEMBER'
                }
            })

            await tx.group.update({
                where: {
                    id: groupId
                },
                data: {
                    memberCount: { increment: 1 },

                }
            })



            await tx.groupJoinRequest.delete({
                where: {
                    userId_groupId: {
                        userId, groupId
                    }
                }
            })
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}