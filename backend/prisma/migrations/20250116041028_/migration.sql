/*
  Warnings:

  - You are about to drop the column `description` on the `Parameter` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ParameterScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParameterType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParamterData` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[type]` on the table `Parameter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[field]` on the table `Parameter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `field` to the `Parameter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Parameter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParameterScore" DROP CONSTRAINT "ParameterScore_paramterId_fkey";

-- DropForeignKey
ALTER TABLE "ParamterData" DROP CONSTRAINT "ParamterData_parameterId_fkey";

-- DropForeignKey
ALTER TABLE "ParamterData" DROP CONSTRAINT "ParamterData_typeId_fkey";

-- DropForeignKey
ALTER TABLE "ParamterData" DROP CONSTRAINT "ParamterData_userId_fkey";

-- AlterTable
ALTER TABLE "Parameter" DROP COLUMN "description",
ADD COLUMN     "field" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userType",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ParameterScore";

-- DropTable
DROP TABLE "ParameterType";

-- DropTable
DROP TABLE "ParamterData";

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "refresh_data_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,
    "urlId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suggestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,
    "urlId" TEXT NOT NULL,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_userId_key" ON "Url"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_urlId_key" ON "Report"("urlId");

-- CreateIndex
CREATE UNIQUE INDEX "Suggestion_urlId_key" ON "Suggestion"("urlId");

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_type_key" ON "Parameter"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_field_key" ON "Parameter"("field");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
