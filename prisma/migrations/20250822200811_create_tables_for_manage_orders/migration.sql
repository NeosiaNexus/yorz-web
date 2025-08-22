-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'WORKING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderStepType" AS ENUM ('NORMAL', 'FINAL');

-- DropForeignKey
ALTER TABLE "storage_file" DROP CONSTRAINT "storage_file_uploaderId_fkey";

-- AlterTable
ALTER TABLE "storage_file" ALTER COLUMN "uploaderId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedDeliveryDate" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,
    "workerId" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_step" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "type" "OrderStepType" NOT NULL DEFAULT 'NORMAL',
    "itemId" TEXT,
    "orderItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_review" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "orderStepId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderStepFeedbackToStorageFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderStepFeedbackToStorageFile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- CreateIndex
CREATE INDEX "_OrderStepFeedbackToStorageFile_B_index" ON "_OrderStepFeedbackToStorageFile"("B");

-- AddForeignKey
ALTER TABLE "storage_file" ADD CONSTRAINT "storage_file_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "portfolio_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_step" ADD CONSTRAINT "order_step_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "storage_file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_step" ADD CONSTRAINT "order_step_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_review" ADD CONSTRAINT "order_review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_review" ADD CONSTRAINT "order_review_orderStepId_fkey" FOREIGN KEY ("orderStepId") REFERENCES "order_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderStepFeedbackToStorageFile" ADD CONSTRAINT "_OrderStepFeedbackToStorageFile_A_fkey" FOREIGN KEY ("A") REFERENCES "order_review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderStepFeedbackToStorageFile" ADD CONSTRAINT "_OrderStepFeedbackToStorageFile_B_fkey" FOREIGN KEY ("B") REFERENCES "storage_file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
