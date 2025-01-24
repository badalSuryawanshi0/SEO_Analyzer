/*
  Warnings:

  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Parameters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Parameters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- AlterTable
ALTER TABLE "Parameters" ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Report";

-- CreateTable
CREATE TABLE "ParamterData" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "parameterId" TEXT NOT NULL,

    CONSTRAINT "ParamterData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParamterData" ADD CONSTRAINT "ParamterData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParamterData" ADD CONSTRAINT "ParamterData_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
