/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,gameId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserPlatform" AS ENUM ('MAC', 'ANDROID', 'IOS', 'PLAYSTATION', 'WINDOWS', 'XBOX', 'NINTENDO', 'LINUX', 'ARCADE', 'WII');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('NOT_STARTED', 'PLAYING', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "CollectionVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "cover" TEXT,
ADD COLUMN     "visibility" "CollectionVisibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "MyGame" ADD COLUMN     "hours_played" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "owned_platform" "UserPlatform",
ADD COLUMN     "status" "GameStatus" DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "played_platform" "UserPlatform";

-- CreateTable
CREATE TABLE "Favourite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favourite_userId_gameId_key" ON "Favourite"("userId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_userId_gameId_key" ON "Playlist"("userId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_gameId_key" ON "Rating"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
