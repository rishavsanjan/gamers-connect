import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import React from 'react'
import InfiniteCollectionGamesList from './InfiniteCollectionGamesList';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(
    { params }: { params: Promise<{ collectionId: string }> }
): Promise<Metadata> {
    const { collectionId } = await params;

    const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
        select: { name: true },
    });

    return {
        title: collection?.name ? `${collection.name} | GamersConnect` : "Collection | GamersConnect",
    };
}

const page = async ({ params }: { params: Promise<{ collectionId: string }> }) => {
    const { collectionId } = await params;

    const session = await auth();
    const userId = session?.user.id;

    const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
        include: {
            _count: { select: { games: true } },
            games: {
                include: { genres: true, platforms: true },
                take: 5
            }
        },
    })

    if (!collection) {
        notFound();
    }

    const games = collection?.games.map((game) => {
        return game;
    });

    const visibility = collection.visibility === 'PUBLIC' ? true : false

    return (
        <div>
            {/* @ts-ignore */}
            <InfiniteCollectionGamesList initialGames={games}
                collectionId={collectionId}
                userId={userId}
                gamesCount={collection._count.games}
                visibility={visibility}
                collectionName={collection.name}
            />
        </div>
    )
}

export default page