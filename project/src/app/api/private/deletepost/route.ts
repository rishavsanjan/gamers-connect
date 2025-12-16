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

        await prisma.$transaction(async (tx) => {
            await tx.commentReaction.deleteMany({
                where: {
                    comment: { postId }
                }
            })

            await tx.comment.deleteMany({
                where: {
                    postId
                }
            })

            await tx.like.deleteMany({
                where: {
                    postId
                }
            })

            await tx.post.delete({
                where: {
                    id: postId
                }
            })
        })

        return NextResponse.json({ success: true }, { status: 201 })



    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}