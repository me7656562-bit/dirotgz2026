import type { WalkDistance } from "@prisma/client";
import { mockListings, type MockListing } from "@/lib/mockData";

export type ListingSearch = {
  walkDistance?: WalkDistance;
  minBeds?: number;
};

export async function findPublishedListings(filters: ListingSearch): Promise<MockListing[]> {
  const { walkDistance, minBeds } = filters;

  // Mock implementation for development
  return mockListings.filter(listing => {
    if (!listing.published || listing.isRented) return false;
    if (walkDistance && listing.walkDistance !== walkDistance) return false;
    if (minBeds) {
      const totalBeds = (listing.bedsDouble || 0) + (listing.bedsJewish || 0);
      if (totalBeds < minBeds) return false;
    }
    return true;
  });
}

export async function getListingById(id: string): Promise<MockListing | null> {
  // Mock implementation for development
  return mockListings.find(listing => listing.id === id) || null;
}
