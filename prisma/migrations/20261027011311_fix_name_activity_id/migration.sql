/*
  Warnings:

  - You are about to drop the column `acitivityId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `activityId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_acitivityId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "acitivityId",
ADD COLUMN     "activityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
