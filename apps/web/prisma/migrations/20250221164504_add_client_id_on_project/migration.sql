/*
  Warnings:

  - You are about to drop the column `client_id` on the `timesheets` table. All the data in the column will be lost.
  - Added the required column `client_id` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "timesheets" DROP CONSTRAINT "timesheets_client_id_fkey";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "client_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "timesheets" DROP COLUMN "client_id";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
