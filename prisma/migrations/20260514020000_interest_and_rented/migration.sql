-- Add isRented to Listing
ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "isRented" BOOLEAN NOT NULL DEFAULT false;

-- Create Interest table
CREATE TABLE IF NOT EXISTS "Interest" (
  "id"        TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "listingId" TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "name"      TEXT,
  CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- Unique: one interest per email per listing
CREATE UNIQUE INDEX IF NOT EXISTS "Interest_listingId_email_key" ON "Interest"("listingId", "email");

-- FK
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_listingId_fkey"
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
