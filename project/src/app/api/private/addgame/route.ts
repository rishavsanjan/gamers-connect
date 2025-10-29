import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

export async function POST(req: Request) {


    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        const body = await req.json();
        const { name, igdb_id, summary, storyline, first_release_date, total_rating, cover, game_type, genres, platforms, model, user_rating, owned_platform, status } = body;
        console.log(status)
        let game = await prisma.game.findUnique({
            where: {
                igdb_id: igdb_id
            }
        })

        if (!game) {
            game = await prisma.game.create({
                data: {
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

        }
        let myGame;
        let playlist;
        let rating;
        let gameInCollection;

        if (model === 'myGame') {
            myGame = await prisma.myGame.create({
                data: {
                    userId: session.user.id,
                    gameId: game.id,
                    owned_platform,
                    status
                },
            });
        } else if (model === 'playlist') {
            playlist = await prisma.playlist.create({
                data: {
                    userId: session.user.id,
                    gameId: game.id,
                },
            });
        } else if (model === 'rating') {
            rating = await prisma.rating.create({
                data: {
                    user_rating,
                    userId: session.user.id,
                    gameId: game.id,
                },
            });
        }




        return NextResponse.json({ myGame, success: true }, { status: 201 });
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }

}
