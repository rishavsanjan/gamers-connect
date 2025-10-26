import { NextResponse } from "next/server";
import { prisma } from '@/lib/db'
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, description } = body;
        const collection = await prisma.collection.create({
            data: {
                name,
                description,
                userId: session.user.id
            }
        })

        return NextResponse.json({
            collection
        })

    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}