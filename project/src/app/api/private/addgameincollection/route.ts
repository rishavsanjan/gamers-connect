import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

export async function POST(req: Request) {


    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { collectionId, name, igdb_id, summary, storyline, first_release_date, total_rating, cover, game_type, genres, platforms } = await req.json();
        const existingGame = await prisma.game.upsert({
            where: { igdb_id },
            update: {},
            create: {
                name,
                igdb_id,
                summary,
                storyline,
                first_release_date: first_release_date ? String(first_release_date) : null,
                total_rating,
                cover: cover?.url || null,
                game_type: game_type === "Main Game" ? "Main_Game" :
                    game_type === "Expansion" ? "Expansion" :
                        game_type === "Expanded Game" ? "Expanded_Game" : "Main_Game",
                genres: {
                    connectOrCreate: genres?.map((g: any) => ({
                        where: { name: g.name },  // Use name instead of id
                        create: { name: g.name },
                    })) || [],
                },
                platforms: {
                    connectOrCreate: platforms?.map((p: any) => ({
                        where: { name: p.name },  // Use name instead of id
                        create: { name: p.name },
                    })) || [],
                },
            },
        });

        const collection = await prisma.collection.update({
            where: { id: collectionId },
            data: {
                games: {
                    connect: { id: existingGame.id },
                },
            },
        });

        return NextResponse.json({ collection }, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }

}
