import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ msg: 'Not Authorized' }, { status: 401 })
        }

        const { memberId, groupId } = await req.json();

        const result = await prisma.$transaction(async (tx) => {
            const updatedGroup = await tx.group.update({
                where: { id: groupId },
                data: {
                    memberCount: { decrement: 1 }
                }
            });

            await tx.groupMember.delete({
                where: {
                    userId_groupId: {
                        userId: memberId,
                        groupId
                    }
                }
            })

            await tx.like.deleteMany({
                where: {
                    post: {
                        userId: memberId,
                        groupId
                    }
                }
            })

            await tx.comment.deleteMany({
                where: {
                    post: {
                        userId: memberId,
                        groupId
                    }
                }
            })

            await tx.post.deleteMany({
                where: {
                    groupId,
                    userId: memberId
                }
            });

            return updatedGroup;
        })



        return NextResponse.json({ result }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 })

    }

}