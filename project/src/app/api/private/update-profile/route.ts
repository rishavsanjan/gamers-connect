import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id;

        const { username, name, bio, twitch, x, discord, instagram, facebook, steam, youtube, profilePicture , privacy} = await req.json();


        const user = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                username,
                name,
                bio,
                avatar: profilePicture,
                privacy,
                socialLinks: {
                    upsert: [
                        {
                            where: { userId_type: { userId, type: "TWITCH" } },
                            update: { link: twitch },
                            create: { link: twitch, type: "TWITCH" }
                        },
                        {
                            where: { userId_type: { userId, type: "X" } },
                            update: { link: x },
                            create: { link: x, type: "X" }
                        },
                        {
                            where: { userId_type: { userId, type: "DISCORD" } },
                            update: { link: discord },
                            create: { link: discord, type: "DISCORD" }
                        },
                        {
                            where: { userId_type: { userId, type: "INSTAGRAM" } },
                            update: { link: instagram },
                            create: { link: instagram, type: "INSTAGRAM" }
                        },
                        {
                            where: { userId_type: { userId, type: "FACEBOOK" } },
                            update: { link: facebook },
                            create: { link: facebook, type: "FACEBOOK" }
                        },
                        {
                            where: { userId_type: { userId, type: "STEAM" } },
                            update: { link: steam },
                            create: { link: steam, type: "STEAM" }
                        },
                        {
                            where: { userId_type: { userId, type: "YOUTUBE" } },
                            update: { link: youtube },
                            create: { link: youtube, type: "YOUTUBE" }
                        }
                    ]
                }
            }
        })

        return NextResponse.json({ user })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
