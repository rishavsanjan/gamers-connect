import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

export async function POST(req: Request) {


    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json();
        const { model, igdb_id } = body;

        const game = await prisma.game.findUnique({
            where: { igdb_id: igdb_id }
        })


        if (model === 'myGame') {
            await prisma.myGame.deleteMany({
                where: { userId: session.user.id, gameId: game?.id }
            })
        }
        if (model === 'rating') {
            await prisma.rating.deleteMany({
                where: { userId: session.user.id, gameId: game?.id }
            })
        }
        if (model === 'playlist') {
            await prisma.playlist.deleteMany({
                where: { userId: session.user.id, gameId: game?.id }
            })
        }

        return NextResponse.json({ success: true }, { status: 200 });


    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }

}
