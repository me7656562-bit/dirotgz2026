"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { mockListings, mockInterests } from "@/lib/mockData";

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

  const listing = mockListings.find(l => l.id === listingId && l.published);
  if (!listing) return { ok: false, message: "מודעה לא נמצאה." };

  // Mock implementation - would normally save to database
  console.log("Mock: User", session.user.email, "interested in listing", listingId);
  
  revalidatePath(`/listings/${listingId}`);
  return { ok: true, message: "✅ סומן! המשכיר יראה את הפרטים שלך. (מצב דמו)" };
}

/** בדיקה אם המשתמש כבר מעוניין + ספירה */
export async function getInterestInfo(listingId: string, userEmail?: string) {
  // Mock implementation
  const userInterested = userEmail ? 
    mockInterests.some(i => i.listingId === listingId && i.email === userEmail) : 
    false;
  
  const count = mockInterests.filter(i => i.listingId === listingId).length;
  
  return { userInterested, count };
}

/** המשכיר רואה רשימת כל המעוניינים */
export async function getInterestedListForOwner(listingId: string, ownerEmail: string) {
  // Mock implementation - only return if user is the owner
  const listing = mockListings.find(l => l.id === listingId);
  if (!listing || listing.publisherEmail !== ownerEmail) {
    return [];
  }
  
  return mockInterests.filter(i => i.listingId === listingId);
}