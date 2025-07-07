/*
  Warnings:

  - You are about to drop the column `description` on the `portfolio_category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `portfolio_category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `portfolio_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "portfolio_category" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "portfolio_item" ADD COLUMN     "mediaId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_category_name_key" ON "portfolio_category"("name");

-- AddForeignKey
ALTER TABLE "portfolio_item" ADD CONSTRAINT "portfolio_item_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "storage_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
