-- CreateTable
CREATE TABLE "public"."storage_file_delete" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "storage_file_delete_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "storage_file_delete_processedAt_idx" ON "public"."storage_file_delete"("processedAt");

-- CreateIndex
CREATE UNIQUE INDEX "storage_file_delete_bucket_path_key" ON "public"."storage_file_delete"("bucket", "path");
