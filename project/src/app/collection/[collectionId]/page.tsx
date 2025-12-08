import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import React from 'react'
import InfiniteCollectionGamesList from './InfiniteCollectionGamesList';

interface Props {
    params: Promise<{ collectionId: string }>
}

const page: React.FC<Props> = async ({ params }) => {

    const { collectionId } = await params;
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
        return
    }

    const games = collection?.games.map((game) => {
        return game;
    });

    const visibility = collection.visibility === 'PUBLIC' ? true : false

    console.log(collection)

    return (
        <div>
            {/* @ts-ignore */}
            <InfiniteCollectionGamesList games={games} collectionId={collectionId} totalGames={collection._count.games} visible={visibility} collection={collection}/>
        </div>
    )
}

export default page