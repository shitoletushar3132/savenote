/*
  Warnings:

  - You are about to drop the column `bgColor` on the `Note` table. All the data in the column will be lost.
  - Added the required column `color` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "bgColor",
ADD COLUMN     "color" TEXT NOT NULL;
