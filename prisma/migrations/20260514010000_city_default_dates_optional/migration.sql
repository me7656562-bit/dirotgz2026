-- Make city have a default value
ALTER TABLE "Listing" ALTER COLUMN "city" SET DEFAULT 'גבעת זאב';

-- Make availableFrom/availableTo have defaults (shavuot 5786)
ALTER TABLE "Listing"
  ALTER COLUMN "availableFrom" SET DEFAULT '2025-06-01T00:00:00Z'::timestamp,
  ALTER COLUMN "availableTo"   SET DEFAULT '2025-06-03T23:59:59Z'::timestamp;
