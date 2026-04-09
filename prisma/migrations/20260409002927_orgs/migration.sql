-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "OrgStatus" NOT NULL DEFAULT 'PENDING',
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Organization_creatorId_idx" ON "Organization"("creatorId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
