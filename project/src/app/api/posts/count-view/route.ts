import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const { postId } = await req.json();

        const post = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        })

        if (!post) {
            return NextResponse.json({ error: 'No posts exists' }, { status: 200 })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
