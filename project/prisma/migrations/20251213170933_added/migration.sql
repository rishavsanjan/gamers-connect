-- CreateEnum
CREATE TYPE "AccountPrivacy" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privacy" "AccountPrivacy" NOT NULL DEFAULT 'PUBLIC';
