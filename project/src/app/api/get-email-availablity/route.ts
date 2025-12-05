import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {

        const { email } = await req.json();

        const available = !!!await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        return NextResponse.json({ available })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
