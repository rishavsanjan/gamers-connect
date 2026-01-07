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

    const activeRequests = await prisma.followRequest.findMany({
        take: limit + 1, 
        skip,
        where: {
            receiverId: session.user.id
        },
        select: {
            sender: {
                select: {
                    id: true,
                    avatar: true,
                    username: true,
                    name: true,
                    xp: true
                }
            },
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const hasMore = activeRequests.length > limit;
    const requestsToReturn = hasMore ? activeRequests.slice(0, limit) : activeRequests;

    const requests = requestsToReturn.map((req) => ({
        ...req.sender,
        createdAt: req.createdAt,
    }));

    return NextResponse.json({
        requests,
        nextPage: hasMore ? page + 1 : undefined
    })
}