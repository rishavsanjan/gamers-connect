import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const take = 5;
    const skip = (page - 1) * take;
    const { collectionId } = await req.json();
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const collection = await prisma.collection.findUnique({
            where: {
                id: collectionId
            },

            include: {
                games: {
                    include: {
                        genres: true,
                        platforms: true
                    },
                    take,
                    skip
                }
            }
        })

        const games = collection?.games.map((game) => {
            return game;
        })


        return NextResponse.json({ games }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}