-- DropForeignKey
ALTER TABLE "portfolio_item" DROP CONSTRAINT "portfolio_item_mediaId_fkey";

-- AddForeignKey
ALTER TABLE "portfolio_item" ADD CONSTRAINT "portfolio_item_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "storage_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;
