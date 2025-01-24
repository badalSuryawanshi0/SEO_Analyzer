/*
  Warnings:

  - You are about to drop the column `description` on the `Parameters` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Parameters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parameters" DROP COLUMN "description",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
