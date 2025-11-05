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

        const { postId, content, parentId } = await req.json();

        const comment = await prisma.$transaction(async (tx) => {
            const newreply = await tx.comment.create({
                data: {
                    content,
                    parentId,
                    postId,
                    userId: session.user.id
                }
            })

            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    commentCount: { increment: 1 }
                }
            })

            return {
                ...newreply,
                user: {
                    id: session.user.id,
                    name: session.user.name
                }
            }
        })

        return NextResponse.json({ comment })

    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
