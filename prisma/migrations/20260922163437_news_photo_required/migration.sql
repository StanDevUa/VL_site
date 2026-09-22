/*
  Warnings:

  - Made the column `photo` on table `NewsPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NewsPost" ALTER COLUMN "photo" SET NOT NULL;
