import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { description, name, igdb_id,
            summary, storyline, first_release_date, total_rating,
            cover, game_type, genres, platforms,
            type, tags, mediaUrls, groupId, visibility } = await req.json();


        let game;
        if (igdb_id) {
            game = await prisma.game.findUnique({
                where: {
                    igdb_id: igdb_id
                }
            })
        }


        console.log(tags)

        if (!game && igdb_id) {
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
                            where: { name: g.name },
                            create: { name: g.name },
                        })) || [],
                    },
                    platforms: {
                        connectOrCreate: platforms?.map((p: any) => ({
                            where: { name: p.name },
                            create: { name: p.name },
                        })) || [],
                    },
                },
            });
        }

        const postData: any = {
            description,
            type,
            userId: session.user.id,
            gameId: game?.id,
            mediaUrls,
            groupId,
            visibility
        };

        if (Array.isArray(tags) && tags.length > 0) {
            postData.tags = {
                connectOrCreate: tags.map((tag: string) => ({
                    where: { name: tag },
                    create: { name: tag },
                })),
            };
        }

        const post = await prisma.post.create({
            data: postData,
            include: {
                tags: true,
                game: true,
                user: true,
            },
        });

        const newpost = await prisma.post.findFirst({
            where: {
                id: post.id
            },
            include: {

                game: {
                    select: {
                        name: true,
                        igdb_id: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                group: {
                    select: { name: true, id: true }
                }

            }
        })

        if (!newpost) {
            return NextResponse.json({ post }, { status: 201 })
        }

        const formattedPost = {
            id: post.id,
            description: newpost.description,
            likeCount: newpost.likeCount,
            commentCount: newpost.commentCount,
            hasLiked: false,
            user: newpost.user,
            game: newpost.game,
            createdAt: newpost.createdAt,
            mediaUrls: newpost.mediaUrls,
            gameId: newpost.gameId,
            userId: newpost.userId,
            updatedAt: newpost.updatedAt,
            type: newpost.type,
            group: newpost.group,
            hasBookmarked: false
        };


        return NextResponse.json({ post, formattedPost }, { status: 201 })



    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}