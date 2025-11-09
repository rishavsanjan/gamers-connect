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
  });

  const followersWithoutFormatting = await prisma.follow.findMany({
    where: {
      followingId: session.user.id,
    },
    include: {
      follower: {
        select: {
          name: true,
          username: true,
          id: true
        }
      }
    },
  });

  const followerIds = followersWithoutFormatting.map(f => f.followerId);

  const myFollows = await prisma.follow.findMany({
    where: {
      followerId: session.user.id,
      followingId: { in: followerIds },
    },
    select: { followingId: true },
  });

  const myFollowingSet = new Set(myFollows.map(f => f.followingId));



  const followers = followersWithoutFormatting.map(f => ({
    ...f.follower,
    isFollowingBack: myFollowingSet.has(f.followerId),
  }));

  console.log(followers)


  const followingWithoutFormatting = await prisma.follow.findMany({
    where: {
      followerId: session.user.id,
    },
    include: {
      following: {
        select: {
          name: true,
          username: true,
          id: true
        }
      }
    },
  });

  const following = followingWithoutFormatting.map((item) => {
    return { ...item.following, isFollowingBack: true };
  })



  console.log(following)



  const playlistCount = await prisma.playlist.count({
    where: {
      userId: session.user.id
    }
  })

  const ownedGamesCount = await prisma.myGame.count({
    where: {
      userId: session.user.id
    }
  })
  const collectionCount = await prisma.collection.count({
    where: {
      userId: session.user.id
    }
  })
  const ratingsCount = await prisma.rating.count({
    where: {
      userId: session.user.id
    }
  })
  const bookmarkCount = await prisma.bookmark.count({
    where: {
      userId: session.user.id
    }
  })





  console.log(bookmarks)

  //@ts-ignore
  const profileData: ProfileTabsData = { ratings, mygames, playlist, collection, stats: allMyGamesForStats, currentlyPlaying };




  return (
    <div>
      <div className='flex items-center flex-col mb-8'>
        <div className='bg-purple-500 p-4 m-4 w-18 h-18 rounded-full'>
          <h1 className='text-4xl text-center'>{session?.user.username[0].toUpperCase()}</h1>
        </div>
        <h1 className='text-5xl'>{session?.user.username}</h1>
      </div>

      <ProfileTabs {...profileData} bookmarkedPosts={bookmarkedPosts} playlistCount={playlistCount} ownedGamesCount={ownedGamesCount} collectionCount={collectionCount} ratingsCount={ratingsCount} bookmarkCount={bookmarkCount} follower={followers} following={following} />
    </div>
  )
}

export default Profile