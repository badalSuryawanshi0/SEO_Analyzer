/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Parameters` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Parameters_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Parameters_type_key" ON "Parameters"("type");
