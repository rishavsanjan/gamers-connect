import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { groupId } = await req.json();

        const isRequestSent = (await prisma.groupJoinRequest.count({
            where: {
                userId: session?.user.id,
                groupId
            }
        })) > 0 ? true : false;

        if (isRequestSent) {
            await prisma.groupJoinRequest.delete({
                where: {
                    userId_groupId: {
                        userId: session.user.id,
                        groupId
                    }
                }
            })
        } else {
            await prisma.groupJoinRequest.create({
                data: {
                    userId: session.user.id,
                    groupId: groupId,
                }
            })
        }



        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}