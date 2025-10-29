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



  const profileData: ProfileTabsData = { ratings, mygames, playlist, collection };



  console.log(ratings, mygames, playlist, collection)

  return (
    <div>
      <div className='bg-purple-500 w-fit m-4 p-4 rounded-full'>
        <h1 className='text-4xl text-center'>{session?.user.username[0].toUpperCase()}</h1>
      </div>
      <h1 className='text-5xl'>{session?.user.username}</h1>
      <ProfileTabs {...profileData} />
    </div>
  )
}

export default Profile