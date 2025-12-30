import { NextResponse } from "next/server";
import { prisma } from '@/lib/db'
import { auth } from "@/auth";


export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let { visibility, privacy, groupName } = await req.json();
        visibility = visibility.toUpperCase();
        privacy = privacy.toUpperCase();
        console.log(visibility, privacy, groupName)

        const result = await prisma.$transaction(async (tx) => {
            const group = await tx.group.create({
                data: {
                    visibility,
                    name: groupName.trim(),
                    privacy,
                    ownerId: session.user.id,
                    memberCount: 1
                }
            })



            await tx.groupMember.create({
                data: {
                    userId: session.user.id,
                    groupId: group.id,
                    role: "OWNER"
                }
            });

            return group;

        })


        return NextResponse.json({ result }, { status: 200 })


    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}