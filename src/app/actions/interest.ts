"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type ActionResult = { ok: boolean; message: string };

/** שוכר מסמן מעוניין */
export async function markInterestAction(
  listingId: string,
  data: { phone?: string; message?: string } = {}
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, message: "יש להתחבר כדי לסמן עניין." };
  }

  const listing = await prisma.listing.findFirst({
    where: { id: listingId, published: true },
    select: { id: true, title: true, contactPhone: true, publisherEmail: true },
  });
  if (!listing) return { ok: false, message: "מודעה לא נמצאה." };

  const phone = (data.phone ?? "").trim().slice(0, 30) || null;
  const message = (data.message ?? "").trim().slice(0, 500) || null;

  await prisma.interest.upsert({
    where: { listingId_email: { listingId, email: session.user.email } },
    update: { phone: phone ?? undefined, message: message ?? undefined },
    create: {
      listingId,
      email: session.user.email,
      name: session.user.name ?? undefined,
      phone: phone ?? undefined,
      message: message ?? undefined,
    },
  });

  revalidatePath(`/listings/${listingId}`);
  return { ok: true, message: "✅ סומן! המשכיר יראה את הפרטים שלך." };
}

/** משכיר מסמן שהדירה הושכרה */
export async function markRentedAction(listingId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, message: "יש להתחבר." };
  }

  const listing = await prisma.listing.findFirst({
    where: { id: listingId, publisherEmail: session.user.email },
    select: { id: true },
  });
  if (!listing) {
    return { ok: false, message: "אין הרשאה — רק המשכיר יכול לסמן הושכרה." };
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { isRented: true, published: false },
  });

  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/listings");
  return { ok: true, message: "✅ המודעה סומנה כמושכרת והוסרה מהרשימה." };
}

/** מחזיר ספירה והאם המשתמש סימן (לכל אחד) */
export async function getInterestInfo(listingId: string, userEmail?: string | null) {
  const count = await prisma.interest.count({ where: { listingId } });
  const isMine = userEmail
    ? (await prisma.interest.findUnique({
        where: { listingId_email: { listingId, email: userEmail } },
        select: { id: true },
      })) !== null
    : false;
  return { count, isMine };
}

/** מחזיר רשימת מתעניינים — רק עבור המשכיר */
export async function getInterestedListForOwner(listingId: string) {
  const session = await auth();
  if (!session?.user?.email) return [];
  const listing = await prisma.listing.findFirst({
    where: { id: listingId, publisherEmail: session.user.email },
    select: { id: true },
  });
  if (!listing) return [];

  return prisma.interest.findMany({
    where: { listingId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      email: true,
      name: true,
      phone: true,
      message: true,
    },
  });
}
