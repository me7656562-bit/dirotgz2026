-- AlterTable: add new listing detail fields
ALTER TABLE "Listing"
  ADD COLUMN IF NOT EXISTS "address"          TEXT,
  ADD COLUMN IF NOT EXISTS "floor"            INTEGER,
  ADD COLUMN IF NOT EXISTS "bedsDouble"       INTEGER,
  ADD COLUMN IF NOT EXISTS "bedsJewish"       INTEGER,
  ADD COLUMN IF NOT EXISTS "mattresses"       INTEGER,
  ADD COLUMN IF NOT EXISTS "cribs"            INTEGER,
  ADD COLUMN IF NOT EXISTS "sofa"             BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "bedLinens"        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "ac"               BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "shabbatPlate"     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "shabbatUrnBoiler" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "shabbatClock"     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "bathrooms"        INTEGER,
  ADD COLUMN IF NOT EXISTS "balconyType"      TEXT,
  ADD COLUMN IF NOT EXISTS "balconySize"      TEXT,
  ADD COLUMN IF NOT EXISTS "livingRoomSize"   TEXT,
  ADD COLUMN IF NOT EXISTS "diningTable"      TEXT,
  ADD COLUMN IF NOT EXISTS "chairs"           TEXT;

-- Make description optional
ALTER TABLE "Listing" ALTER COLUMN "description" DROP NOT NULL;
