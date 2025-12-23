import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const session = await auth();
        const { query } = await req.json();

        if (!session) {
            return NextResponse.json({ msg: 'Unauthorized' }, { status: 200 })
        }

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: "insensitive" } },
                    { name: { contains: query, mode: "insensitive" } },

                ],
                NOT: { id: session?.user.id }
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true
            }, take: 5
        })

        return NextResponse.json({ users }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
