-- CreateEnum
CREATE TYPE "GroupPrivacy" AS ENUM ('PRIVATE', 'PUBLIC');

-- CreateEnum
CREATE TYPE "GroupVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "privacy" "GroupPrivacy" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "visibility" "GroupVisibility" NOT NULL DEFAULT 'PRIVATE';
