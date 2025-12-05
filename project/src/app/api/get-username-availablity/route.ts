import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        
        const {username} = await req.json();

        const available = !!!await prisma.user.findFirst({
            where:{
                username:username
            }
        })
        console.log(username)
        console.log(available)

        return NextResponse.json({ available })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
