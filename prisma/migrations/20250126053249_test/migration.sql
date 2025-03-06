/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Questionnaire` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Questionnaire_userId_idx";

-- AlterTable
ALTER TABLE "Questionnaire" DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
