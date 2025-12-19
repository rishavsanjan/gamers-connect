import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';

const CACHE_KEY = 'top-tags';
const TTL = 60 * 10;

export async function getTopTags() {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
        console.log('⚡ Redis HIT');
        return;
    }

    console.log('🐢 Redis MISS');

    const tags = await prisma.hashtag.findMany({
        take: 5,
        orderBy: {
            posts: {
                _count: 'desc',
            },
        },
        include: {
            _count: {
                select: { posts: true },
            },
        },
    });

    await redis.set(
        'top-tags',
        JSON.stringify(tags),
        { ex: 600 }
    );


    return tags;
}
