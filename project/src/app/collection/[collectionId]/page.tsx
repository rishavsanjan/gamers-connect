import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import React from 'react'
import InfiniteCollectionGamesList from './InfiniteCollectionGamesList';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(
    { params }: { params: { collectionId: string } }
): Promise<Metadata> {
    const collection = await prisma.collection.findUnique({
        where: { id: params.collectionId },
        select: { name: true },
    });

    return {
        title: collection?.name
            ? `${collection.name} | GamersConnect`
            : "Collection | GamersConnect",
    };
}

// interface Props {
//     params: { collectionId: string }
// }

const page = async ({ params }: { params: { collectionId: string } }) => {

    const { collectionId } =  params;
    const session = await auth();
    const userId = session?.user.id;


    const collection = await prisma.collection.findUnique({

        where: {
            id: collectionId
        },

        include: {
            _count: {
                select: {
                    games: true
                }
            },
            games: {
                include: {
                    genres: true,
                    platforms: true
                },
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
            <InfiniteCollectionGamesList games={games} collectionId={collectionId} totalGames={collection._count.games} visible={visibility} collection={collection} />
        </div>
    )
}

export default page