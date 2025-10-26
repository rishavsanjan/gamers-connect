import { NextResponse } from "next/server";
import { prisma } from '@/lib/db'
import { auth } from "@/auth";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const gameId = searchParams.get("gameId");
        if (!gameId) {
            return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
        }

        const collections = await prisma.collection.findMany({
            where: { userId: session.user.id },
            include: { games: { select: { igdb_id: true, name: true } } },
        });

        const collectionsWithStatus = collections.map((col) => ({
            id: col.id,
            name: col.name,
            description: col.description,
            hasGame: col.games.some((game) => game.igdb_id === Number(gameId)),
        }));

        return NextResponse.json({ collections: collectionsWithStatus }, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}