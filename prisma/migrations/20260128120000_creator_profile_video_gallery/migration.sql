-- AlterTable
ALTER TABLE "CreatorProfile" ADD COLUMN "videoUrl" TEXT,
ADD COLUMN "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
