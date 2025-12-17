import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 2)
    const skip = (page - 1) * limit

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { senderId, receiverId } = await req.json();

        const isRequestSent =
            (await prisma.followRequest.count({
                where: { senderId, receiverId },
            })) > 0;

        if (isRequestSent) {
            await prisma.followRequest.delete({
                where: {
                    senderId_receiverId: {
                        senderId,
                        receiverId
                    }
                }
            })
        } else {
            await prisma.followRequest.create({
                data: {
                    senderId,
                    receiverId
                }
            })
        }


        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}