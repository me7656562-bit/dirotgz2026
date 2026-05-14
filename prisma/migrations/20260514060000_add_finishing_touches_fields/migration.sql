-- Add new fields for finishing touches (only if they don't exist)
DO $$ 
BEGIN
    -- Add roomsClosed if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Listing' AND column_name = 'roomsClosed') THEN
        ALTER TABLE "Listing" ADD COLUMN "roomsClosed" INTEGER;
    END IF;
    
    -- Add kosherKitchen if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Listing' AND column_name = 'kosherKitchen') THEN
        ALTER TABLE "Listing" ADD COLUMN "kosherKitchen" BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    -- Add chairsCount if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Listing' AND column_name = 'chairsCount') THEN
        ALTER TABLE "Listing" ADD COLUMN "chairsCount" INTEGER;
    END IF;
END $$;