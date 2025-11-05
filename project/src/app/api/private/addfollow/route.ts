// app/api/mygames/route.ts
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { followerId, followingId } = await req.json();
        console.log(followerId, followingId)

        const isFollowing = !!await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        })

        if (isFollowing) {
            const unfollow = await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: followerId,
                        followingId: followingId,
                    },
                },
            });

            return NextResponse.json(unfollow)


        } else {
            const follow = await prisma.follow.create({
                data: {
                    followerId,
                    followingId
                }
            })

            return NextResponse.json(follow)
        }




    } catch (error) {
        console.log(error);
        return NextResponse.json('Server Error', { status: 500 })
    }

}
