/*
  Warnings:

  - You are about to drop the column `likeCount` on the `CommentReaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CommentReaction" DROP COLUMN "likeCount";
