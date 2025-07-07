/*
  Warnings:

  - You are about to drop the column `name` on the `portfolio_category` table. All the data in the column will be lost.
  - Added the required column `colorVariant` to the `portfolio_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaExampleId` to the `portfolio_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `portfolio_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `portfolio_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `portfolio_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "portfolio_category_name_key";

-- AlterTable
ALTER TABLE "portfolio_category" DROP COLUMN "name",
ADD COLUMN     "colorVariant" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "mediaExampleId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "price" TEXT NOT NULL,
ADD COLUMN     "priceComplement" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "underDescription" TEXT;

-- AddForeignKey
ALTER TABLE "portfolio_category" ADD CONSTRAINT "portfolio_category_mediaExampleId_fkey" FOREIGN KEY ("mediaExampleId") REFERENCES "storage_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
