/*
  Warnings:

  - You are about to drop the column `percentage` on the `ParamterData` table. All the data in the column will be lost.
  - You are about to drop the column `rawData` on the `ParamterData` table. All the data in the column will be lost.
  - You are about to drop the `Parameters` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `data` to the `ParamterData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `ParamterData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `ParamterData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParamterData" DROP CONSTRAINT "ParamterData_parameterId_fkey";

-- DropForeignKey
ALTER TABLE "ParamterData" DROP CONSTRAINT "ParamterData_userId_fkey";

-- AlterTable
ALTER TABLE "ParamterData" DROP COLUMN "percentage",
DROP COLUMN "rawData",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "score" DECIMAL(3,2) NOT NULL,
ADD COLUMN     "typeId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Parameters";

-- CreateTable
CREATE TABLE "Parameter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParameterType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ParameterType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParameterScore" (
    "id" TEXT NOT NULL,
    "paramterId" TEXT NOT NULL,
    "overallScore" DECIMAL(3,2) NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParameterScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_name_key" ON "Parameter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ParameterType_name_key" ON "ParameterType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ParameterScore_paramterId_key" ON "ParameterScore"("paramterId");

-- AddForeignKey
ALTER TABLE "ParamterData" ADD CONSTRAINT "ParamterData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParamterData" ADD CONSTRAINT "ParamterData_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParamterData" ADD CONSTRAINT "ParamterData_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ParameterType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParameterScore" ADD CONSTRAINT "ParameterScore_paramterId_fkey" FOREIGN KEY ("paramterId") REFERENCES "Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
