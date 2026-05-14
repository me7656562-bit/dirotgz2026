-- Final schema updates for finishing touches
-- This migration is safe and will only add columns that don't exist

-- Add roomsClosed column
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "roomsClosed" INTEGER;

-- Add kosherKitchen column  
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "kosherKitchen" BOOLEAN DEFAULT false;

-- Add chairsCount column
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "chairsCount" INTEGER;

-- Update kosherKitchen to NOT NULL after adding default values
UPDATE "Listing" SET "kosherKitchen" = false WHERE "kosherKitchen" IS NULL;
ALTER TABLE "Listing" ALTER COLUMN "kosherKitchen" SET NOT NULL;