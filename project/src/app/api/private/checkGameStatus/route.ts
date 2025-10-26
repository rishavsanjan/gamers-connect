import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

export async function GET(req: Request) {


    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const igdb_id = Number(searchParams.get("igdb_id"));
        if (!igdb_id) {
            return NextResponse.json({ error: "Invalid game id" }, { status: 400 });
        }

        // ✅ 1. Find the game by igdb_id
        const game = await prisma.game.findUnique({
            where: { igdb_id },
            select: { id: true },
        });

        if (!game) {
            return NextResponse.json({
                exists: false,
                inMyGames: false,
                inPlaylist: false,
                rated: false,
            });
        }

        // ✅ 2. Check if user has this game in "My Games"
        const myGame = await prisma.myGame.findFirst({
            where: {
                userId: session.user.id,
                gameId: game.id,
            },
        });

        // ✅ 3. Check if user has this game in "Playlist"
        const playlist = await prisma.playlist.findFirst({
            where: {
                userId: session.user.id,
                gameId: game.id,
            },
        });

        // ✅ 4. Check if user has rated this game
        const rating = await prisma.rating.findFirst({
            where: {
                userId: session.user.id,
                gameId: game.id,
            },
            select:{
                user_rating:true
            }
        });

        return NextResponse.json({
            exists: true,
            inMyGames: !!myGame,
            inPlaylist: !!playlist,
            rated: rating,
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }

}
