-- CreateEnum
CREATE TYPE "public"."CommentType" AS ENUM ('MESSAGE', 'REPLY');

-- AlterTable
ALTER TABLE "public"."portfolio_item" ADD COLUMN     "commentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."portfolio_item_like" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_item_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."portfolio_item_comment" (
    "id" TEXT NOT NULL,
    "type" "public"."CommentType" NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "itemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_item_comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "portfolio_item_like_userId_itemId_idx" ON "public"."portfolio_item_like"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_item_like_itemId_userId_key" ON "public"."portfolio_item_like"("itemId", "userId");

-- CreateIndex
CREATE INDEX "portfolio_item_comment_itemId_idx" ON "public"."portfolio_item_comment"("itemId");

-- CreateIndex
CREATE INDEX "portfolio_item_comment_userId_idx" ON "public"."portfolio_item_comment"("userId");

-- AddForeignKey
ALTER TABLE "public"."portfolio_item_like" ADD CONSTRAINT "portfolio_item_like_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."portfolio_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolio_item_like" ADD CONSTRAINT "portfolio_item_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolio_item_comment" ADD CONSTRAINT "portfolio_item_comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."portfolio_item_comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolio_item_comment" ADD CONSTRAINT "portfolio_item_comment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."portfolio_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portfolio_item_comment" ADD CONSTRAINT "portfolio_item_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
