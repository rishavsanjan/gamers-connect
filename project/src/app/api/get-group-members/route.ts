import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 2);
    const skip = (page - 1) * limit
    const { groupId } = await req.json();
    
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const members = await prisma.group.findMany({
            skip,
            take: limit,
            where: {
                id: groupId
            },
            include: {
                members: {
                    select: { username: true, id: true, name: true, avatar: true }
                },
                admins: {
                    select: { username: true, id: true, name: true, avatar: true }
                },

            },

        })

        const admins = members.flatMap(item =>
            item.admins.map(admin => ({
                ...admin,
                role: "admin"
            }))
        );

        const allMembers = members.flatMap(item =>
            item.members.map(member => ({
                ...member,
                role: "member"
            }))
        );

        const roleMap = new Map();

        for (const m of allMembers) {
            roleMap.set(m.id, m);
        }

        for (const a of admins) {
            roleMap.set(a.id, a);
        }

        const finalUsers = Array.from(roleMap.values());

        return NextResponse.json({ users: finalUsers }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}