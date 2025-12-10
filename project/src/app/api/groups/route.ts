import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const groupId = String(searchParams.get('groupId'));
    try {
        const session = await auth().catch(() => null);
        

        const details = await prisma.group.findFirst({
            where: {
                id: groupId
            },
            include: {
                members: {
                    include: {
                        _count: true
                    }
                }
            }
        })



        return NextResponse.json({}, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}