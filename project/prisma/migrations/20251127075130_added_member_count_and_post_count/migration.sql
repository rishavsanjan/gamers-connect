/*
  Warnings:

  - The values [PRIVATE,PUBLIC] on the enum `GroupVisibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GroupVisibility_new" AS ENUM ('VISIBLE', 'HIDDEN');
ALTER TABLE "public"."Group" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "Group" ALTER COLUMN "visibility" TYPE "GroupVisibility_new" USING ("visibility"::text::"GroupVisibility_new");
ALTER TYPE "GroupVisibility" RENAME TO "GroupVisibility_old";
ALTER TYPE "GroupVisibility_new" RENAME TO "GroupVisibility";
DROP TYPE "public"."GroupVisibility_old";
ALTER TABLE "Group" ALTER COLUMN "visibility" SET DEFAULT 'VISIBLE';
COMMIT;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "memberCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "postCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "visibility" SET DEFAULT 'VISIBLE';
