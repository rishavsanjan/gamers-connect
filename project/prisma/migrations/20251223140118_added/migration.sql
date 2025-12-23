-- CreateTable
CREATE TABLE "GroupInvites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedById" TEXT NOT NULL,

    CONSTRAINT "GroupInvites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupInvites_groupId_idx" ON "GroupInvites"("groupId");

-- CreateIndex
CREATE INDEX "GroupInvites_userId_idx" ON "GroupInvites"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupInvites_userId_groupId_key" ON "GroupInvites"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "GroupInvites" ADD CONSTRAINT "GroupInvites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvites" ADD CONSTRAINT "GroupInvites_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvites" ADD CONSTRAINT "GroupInvites_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
