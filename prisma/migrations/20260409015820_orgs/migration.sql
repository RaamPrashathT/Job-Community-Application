-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "OrganizationReview" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationReview_organizationId_idx" ON "OrganizationReview"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationReview_userId_idx" ON "OrganizationReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationReview_organizationId_userId_key" ON "OrganizationReview"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "Organization_status_idx" ON "Organization"("status");

-- AddForeignKey
ALTER TABLE "OrganizationReview" ADD CONSTRAINT "OrganizationReview_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationReview" ADD CONSTRAINT "OrganizationReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
