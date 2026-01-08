import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 2);
    const skip = (page - 1) * limit
    let { filter, category, groupId } = await req.json();
    if (category === 'ALL') {
        category = '';
    }
    console.log(category)
    try {
        const session = await auth().catch(() => null);


        let where: any = {};

        if (category) {
            where.type = category;
        }

        if (groupId) {
            where.groupId = groupId;
        }

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
            where,
            include: {
                game: { select: { name: true, igdb_id: true } },
                user: { select: { name: true, id: true, username: true, avatar: true } },
                group: { select: { name: true, id: true } },
                Like: { where: { userId: session?.user.id } }
            },
            orderBy:
                filter === "popular"
                    ? { Like: { _count: "desc" } }
                    : { createdAt: "desc" }
        });

        const result = posts.map((post) => ({
            id: post.id,
            description: post.description,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            hasLiked: post.Like.length > 0,
            user: post.user,
            game: post.game,
            createdAt: post.createdAt,
            mediaUrls: post.mediaUrls,
            group: post.group,
            viewCount : post.viewCount
        }));

        return NextResponse.json({ posts: result }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}