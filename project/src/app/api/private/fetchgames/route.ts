// app/api/mygames/route.ts
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const take = 10;
        const skip = (page - 1) * take;
        const tab = searchParams.get('tab');
        console.log(tab)
        console.log(page)
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });


        let mygames;
        if (tab === 'myGames') {
            mygames = await prisma.myGame.findMany({
                where: { userId: session.user.id },
                include: { game: { include: { genres: true, platforms: true } } },
                skip,
                take,
            });
        }


        return NextResponse.json({mygames}, {status:201});
    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
