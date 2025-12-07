import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await auth().catch(() => null)
    const userId = session?.user?.id ?? null;

    const { parentId } = await req.json()

    const replies = await prisma.comment.findMany({
      where: { parentId },
      include: {
        user: { select: { id: true, name: true, username: true, avatar: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ replies })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}