-- AlterTable
ALTER TABLE "VideoRequest" ADD COLUMN     "s3BasePath" TEXT,
ADD COLUMN     "script" TEXT;

-- CreateIndex
CREATE INDEX "VideoRequest_storytellerId_idx" ON "VideoRequest"("storytellerId");
