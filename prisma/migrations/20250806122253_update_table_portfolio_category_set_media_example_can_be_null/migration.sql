-- DropForeignKey
ALTER TABLE "portfolio_category" DROP CONSTRAINT "portfolio_category_mediaExampleId_fkey";

-- AlterTable
ALTER TABLE "portfolio_category" ALTER COLUMN "mediaExampleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "portfolio_category" ADD CONSTRAINT "portfolio_category_mediaExampleId_fkey" FOREIGN KEY ("mediaExampleId") REFERENCES "storage_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;
