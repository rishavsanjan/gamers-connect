import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

export async function POST(req: Request) {


    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { postId } = await req.json();
        const result = await prisma.$transaction(async (tx) => {
            const existingLike = await tx.like.findUnique({
                where: {
                    userId_postId: {
                        userId: session.user.id,
                        postId,
                    },
                },
            });

            if (existingLike) {
                await tx.like.delete({
                    where: { userId_postId: { userId: session.user.id, postId } },
                });

                await tx.post.update({
                    where: { id: postId },
                    data: { likeCount: { decrement: 1 } },
                });

                return { liked: false };
            } else {
                await tx.like.create({
                    data: {
                        userId: session.user.id,
                        postId,
                    },
                });

                await tx.post.update({
                    where: { id: postId },
                    data: { likeCount: { increment: 1 } },
                });

                return { liked: true };
            }
        });

        return NextResponse.json(result);
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }

}
