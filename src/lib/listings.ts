import type { WalkDistance } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db";

export type ListingSearch = {
  city?: string;
  walkDistance?: WalkDistance;
  /** חפיפה עם טווח זמינות: מודעה פעילה אם יש חפיפה */
  availableFrom?: Date;
  availableTo?: Date;
};

export async function findPublishedListings(filters: ListingSearch) {
  const { city, walkDistance, availableFrom, availableTo } = filters;

  return prisma.listing.findMany({
    where: {
      published: true,
      ...(city?.trim()
        ? { city: { contains: city.trim() } }
        : {}),
      ...(walkDistance ? { walkDistance } : {}),
      ...(availableFrom && availableTo
        ? {
            AND: [
              { availableFrom: { lte: availableTo } },
              { availableTo: { gte: availableFrom } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getListingById(id: string) {
  return prisma.listing.findFirst({
    where: { id, published: true },
  });
}
