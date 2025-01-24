/*
  Warnings:

  - You are about to drop the column `weight` on the `Parameters` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `ParamterData` table. All the data in the column will be lost.
  - Added the required column `rawData` to the `ParamterData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parameters" DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "ParamterData" DROP COLUMN "url",
ADD COLUMN     "rawData" JSONB NOT NULL;
