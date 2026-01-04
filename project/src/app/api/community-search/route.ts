import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const { query } = await req.json();

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: "insensitive" } },
                    { name: { contains: query, mode: "insensitive" } },

                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                privacy:true
            }, take: 5
        })

        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { description: { contains: query, mode: "insensitive" } }
                ]
            },
            select: {
                id: true,
                description: true,
                createdAt: true
            }, take: 5
        })

        const groups = await prisma.group.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                coverImage:true,
                privacy:true
            }, take:5
        })

        return NextResponse.json({ users, posts, groups }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
