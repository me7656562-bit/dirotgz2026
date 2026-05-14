import type { WalkDistance } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db";

export type ListingSearch = {
  walkDistance?: WalkDistance;
  minBeds?: number;
};

export async function findPublishedListings(filters: ListingSearch) {
  const { walkDistance, minBeds } = filters;

  return prisma.listing.findMany({
    where: {
      published: true,
      isRented: false,
      ...(walkDistance ? { walkDistance } : {}),
      ...(minBeds ? { beds: { gte: minBeds } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });
}

export async function getListingById(id: string) {
  return prisma.listing.findFirst({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });
}
