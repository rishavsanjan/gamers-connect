/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `SocialLinks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocialLinks_userId_type_key" ON "SocialLinks"("userId", "type");
