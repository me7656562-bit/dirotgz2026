-- CreateEnum
CREATE TYPE "WalkDistance" AS ENUM ('upTo10', 'upTo20', 'over20');

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT,
    "rooms" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL,
    "walkDistance" "WalkDistance" NOT NULL,
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "availableTo" TIMESTAMP(3) NOT NULL,
    "askingPriceNis" INTEGER,
    "contactPhone" TEXT NOT NULL,
    "contactWhatsapp" TEXT,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publisherEmail" TEXT,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
