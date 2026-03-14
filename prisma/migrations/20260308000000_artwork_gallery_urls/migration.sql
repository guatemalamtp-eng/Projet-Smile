-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
