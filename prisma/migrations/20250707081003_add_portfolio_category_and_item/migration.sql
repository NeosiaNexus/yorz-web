-- CreateTable
CREATE TABLE "portfolio_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "portfolio_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_item" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "portfolio_item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "portfolio_item" ADD CONSTRAINT "portfolio_item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "portfolio_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
