import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 2);
    const skip = (page - 1) * limit
    const { groupId } = await req.json();
    try {
        const session = await auth().catch(() => null);
    

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
            where: {
                groupId,
                mediaUrls: {
                    isEmpty: false
                }

            }
        })



        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}