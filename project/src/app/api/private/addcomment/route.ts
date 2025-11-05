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

        const { content, postId, parentId } = await req.json();

        const comment = await prisma.$transaction(async (tx) => {
            let addComment;
            if (parentId) {
                addComment = await tx.comment.create({
                    data: {
                        userId: session.user.id,
                        content,
                        postId,
                        parentId
                    },
                })
            } else {
                addComment = await tx.comment.create({
                    data: {
                        userId: session.user.id,
                        content,
                        postId
                    },
                })
            }


            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    commentCount: { increment: 1 }
                }
            })


            return { ...addComment, user: { name: session.user.name, id: session.user.id } };
        })

        return NextResponse.json({ comment });


    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
