import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const take = 10;
        const skip = (page - 1) * take;
        const tab = searchParams.get('tab');
        const { userId } = await req.json();



        let mygames;
        if (tab === 'myGames') {
            mygames = await prisma.myGame.findMany({
                where: { userId: userId },
                include: { game: { include: { genres: true, platforms: true } } },
                skip,
                take,
            });
        }


        return NextResponse.json({ mygames }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
