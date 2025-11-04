// app/api/mygames/route.ts
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content, postId } = await req.json();
        const comment = await prisma.comment.create({
            data: {
                userId: session.user.id,
                content,
                postId
            }
        })

        return NextResponse.json({ comment }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
