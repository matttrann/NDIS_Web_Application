-- AlterTable
ALTER TABLE "VideoRequest" ADD COLUMN     "captions" TEXT,
ADD COLUMN     "frameKeys" TEXT[],
ADD COLUMN     "srtPath" TEXT;

-- CreateTable
CREATE TABLE "Storyteller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "s3ImageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storyteller_pkey" PRIMARY KEY ("id")
);
