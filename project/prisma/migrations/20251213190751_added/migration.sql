-- CreateEnum
CREATE TYPE "PostPrivacy" AS ENUM ('EVERYONE', 'ONLY_FOLLOWERS', 'GROUP');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "visibility" "PostPrivacy" NOT NULL DEFAULT 'EVERYONE';
