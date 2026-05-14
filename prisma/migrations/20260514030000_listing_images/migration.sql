CREATE TABLE IF NOT EXISTS "ListingImage" (
  "id"        TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "listingId" TEXT NOT NULL,
  "url"       TEXT NOT NULL,
  "publicId"  TEXT,
  "order"     INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ListingImage" ADD CONSTRAINT "ListingImage_listingId_fkey"
  FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
