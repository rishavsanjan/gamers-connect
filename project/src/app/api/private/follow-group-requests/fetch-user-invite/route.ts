import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = 5;
    const skip = (page - 1) * limit;

    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const activeInvites = await prisma.groupInvites.findMany({
        take: limit + 1,
        skip,
        where: {
            userId: session.user.id
        },
        select: {
            group: {
                select: {
                    id: true,
                    name: true,
                    coverImage: true
                }
            }
            , createdAt: true,

        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const hasMore = activeInvites.length > limit;
    const requestsToReturn = hasMore ? activeInvites.slice(0, limit) : activeInvites;

    const invites = requestsToReturn.map((req) => ({
        ...req.group,
        createdAt: req.createdAt,
    }));

    return NextResponse.json({
        invites,
        nextPage: hasMore ? page + 1 : undefined
    })
}