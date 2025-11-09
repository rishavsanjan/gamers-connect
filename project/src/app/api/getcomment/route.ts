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

        const { postId } = await req.json();

        const comment = await prisma.comment.findMany({
            take: limit,
            skip,
            where: { postId, parentId: null },
            include: {
                user: { select: { id: true, name: true, username: true } },
                _count: { select: { replies: true } },
                CommentReaction: {
                    where: { userId: session?.user.id }
                }
            },
            orderBy: { createdAt: 'asc' },
        })

        const comments = comment.map((item) => ({
            id: item.id,
            postId: item.postId,
            content: item.content,
            user: item.user,
            userId: item.userId,
            createdAt: item.createdAt,
            hasLiked: item.CommentReaction.length > 0,
            likeCount: item.likeCount,
            parentId: item.parentId,
            _count: { replies: item._count.replies },


        }))


        return NextResponse.json({ comments }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}