-- AlterTable
ALTER TABLE "Listing" 
ADD COLUMN "code" TEXT,
ADD COLUMN "roomsClosed" INTEGER,
ADD COLUMN "kosherKitchen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "chairsCount" INTEGER;