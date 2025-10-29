import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {

    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ msg: 'Not Authorized' }, { status: 401 })
        }

        const profile = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            include: {
                Rating: true,
                MyGame: true,
                Playlist: true,
                Collection: true
            }
        })

      //  const ownedGames = profile?.MyGame.map

        return NextResponse.json({ profile }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 })

    }

}