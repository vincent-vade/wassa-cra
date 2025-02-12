/*
  Warnings:

  - Made the column `email` on table `freelances` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `freelances` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "freelances" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "password" SET DATA TYPE TEXT;
