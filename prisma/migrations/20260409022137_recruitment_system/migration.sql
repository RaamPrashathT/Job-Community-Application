/*
  Warnings:

  - Added the required column `updatedAt` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'RECRUITED', 'REJECTED');

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "JobPost" ADD COLUMN     "openings" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");
