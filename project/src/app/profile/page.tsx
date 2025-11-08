import { auth } from '@/auth'
import ProfileTabs from '@/components/ProfileTabs';
import { prisma } from '@/lib/prisma';
import React from 'react';
import { ProfileTabsData } from '../types/profile';

const Profile = async () => {
  const session = await auth();
  if (!session?.user.username) {
    return;
  }

  let [ratings, mygames, playlist, collection] = await Promise.all([
    prisma.rating.findMany({
      where: { userId: session.user.id },
      take: 10,
      include: {
        game: {
          include: {
            genres: true,
            platforms: true
          }
        }
      },
    }),
    prisma.myGame.findMany({
      where: { userId: session.user.id },
      take: 10,
      include: {
        game: {
          include: {
            genres: true,
            platforms: true,
          },
        },
      },
    }),
    prisma.playlist.findMany({
      where: { userId: session.user.id },
      take: 10,
      include: {
        game: {
          include: {
            genres: true,
            platforms: true
          }
        }
      },
    }),
    prisma.collection.findMany({
      where: { userId: session.user.id },
      include: {
        games: {
          include: {
            genres: true,
            platforms: true
          }
        }
      },
    }),
  ]);

  const allMyGamesForStats = await prisma.myGame.findMany({
    where: { userId: session.user.id },
    select: {
      owned_platform: true,
      status: true,
      game: {
        select: {
          id: true,
          first_release_date: true,
          genres: { select: { name: true } },
          platforms: { select: { name: true } },
        },
      },
    },
  });

  const currentlyPlaying = await prisma.myGame.findMany({
    where: { userId: session.user.id, status: 'PLAYING' },
    include: {
      game: {
        include: {
          genres: true,
          platforms: true
        }
      }
    },
  });

  const bookmarks = await prisma.bookmark.findMany({
    take: 1,
    where: {
      userId: session.user.id
    },
    select: {
      post: {
        include: {
          user: {
            select: {
              name: true,
              id: true
            }
          },
          game: {
            select: {
              name: true,
              igdb_id: true
            }
          },
          Like: {
            where: { userId: session.user.id }
          }
        },



      },

    }
  })

  const bookmarkedPosts = bookmarks.map((post) => {
    return {
      id: post.post.id,
      description: post.post.description,
      likeCount: post.post.likeCount,
      commentCount: post.post.commentCount,
      hasLiked: post.post.Like.length > 0,
      user: post.post.user,
      game: post.post.game,
      createdAt: post.post.createdAt,
      mediaUrls: post.post.mediaUrls,
      userId: post.post.userId,
      type: post.post.type,
      updatedAt: post.post.updatedAt,
      gameId: post.post.gameId
    };
  })





  console.log(bookmarks)

  //@ts-ignore
  const profileData: ProfileTabsData = { ratings, mygames, playlist, collection, stats: allMyGamesForStats, currentlyPlaying };




  return (
    <div>
      <div className='bg-purple-500 w-fit m-4 p-4 rounded-full'>
        <h1 className='text-4xl text-center'>{session?.user.username[0].toUpperCase()}</h1>
      </div>
      <h1 className='text-5xl'>{session?.user.username}</h1>
      <ProfileTabs {...profileData} bookmarkedPosts={bookmarkedPosts} />
    </div>
  )
}

export default Profile