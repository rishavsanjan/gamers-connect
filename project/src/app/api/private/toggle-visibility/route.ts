import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { collectionId } = await req.json();
        const collection = await prisma.collection.findUnique({
            where: { id: collectionId },
            select: { visibility: true },
        });

        if (!collection) throw new Error("Collection not found");

        const updated = await prisma.collection.update({
            where: { id: collectionId },
            data: {
                visibility: collection.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC"
            }
        });

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json('Server Problem', { status: 500 })
    }
}