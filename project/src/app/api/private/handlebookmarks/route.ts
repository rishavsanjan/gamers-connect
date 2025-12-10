import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { postId } = await req.json();

        const isBookmarked = await prisma.bookmark.findFirst({
            where: {
                postId,
                userId: session.user.id
            }
        })

        if (!isBookmarked) {
            const bookmark = await prisma.bookmark.create({
                data: {
                    postId,
                    userId: session.user.id
                }
            })
            return NextResponse.json({ bookmark, success:true });

        } else {
            const bookmark = await prisma.bookmark.delete({
                where: {
                    userId_postId: {
                        postId,
                        userId: session.user.id
                    }
                }
            })
            return NextResponse.json({ bookmark, success:true });

        }





    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
