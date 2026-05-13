"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { parseWalkDistance } from "@/lib/listingLabels";

export type ListingFormState =
  | { ok: true }
  | { ok: false; message: string }
  | null;

function parseDateOnly(s: string): Date | null {
  const t = s.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const d = new Date(`${t}T12:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createListingAction(
  _prev: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, message: "יש להתחבר עם גוגל כדי לפרסם מודעה." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim() || null;
  const rooms = Number(formData.get("rooms"));
  const beds = Number(formData.get("beds"));
  const walkRaw = String(formData.get("walkDistance") ?? "");
  const walkDistance = parseWalkDistance(walkRaw);
  const availableFrom = parseDateOnly(String(formData.get("availableFrom") ?? ""));
  const availableTo = parseDateOnly(String(formData.get("availableTo") ?? ""));
  const askingRaw = String(formData.get("askingPriceNis") ?? "").trim();
  const askingPriceNis =
    askingRaw === "" ? null : Number.isFinite(Number(askingRaw)) ? Math.round(Number(askingRaw)) : null;
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const contactWhatsapp = String(formData.get("contactWhatsapp") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;

  if (title.length < 3) return { ok: false, message: "כותרת קצרה מדי (לפחות 3 תווים)." };
  if (description.length < 10) return { ok: false, message: "תיאור קצר מדי (לפחות 10 תווים)." };
  if (!city) return { ok: false, message: "יש למלא עיר." };
  if (!Number.isInteger(rooms) || rooms < 1 || rooms > 30) {
    return { ok: false, message: "מספר חדרים לא תקין." };
  }
  if (!Number.isInteger(beds) || beds < 2 || beds > 30) {
    return { ok: false, message: "מספר מיטות חייב להיות בין 2 ל-30." };
  }
  if (!walkDistance) return { ok: false, message: "יש לבחור קטגוריית מרחק." };
  if (!availableFrom || !availableTo || availableFrom > availableTo) {
    return { ok: false, message: "טווח תאריכים לא תקין." };
  }
  if (!contactPhone || contactPhone.length < 8) {
    return { ok: false, message: "יש למלא מספר טלפון ליצירת קשר." };
  }
  if (askingPriceNis !== null && (askingPriceNis < 0 || askingPriceNis > 1_000_000)) {
    return { ok: false, message: "מחיר מבוקש לא סביר." };
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      city,
      neighborhood,
      rooms,
      beds,
      walkDistance,
      availableFrom,
      availableTo,
      askingPriceNis: askingPriceNis ?? undefined,
      contactPhone,
      contactWhatsapp,
      imageUrl,
      publisherEmail: session.user.email,
    },
  });

  revalidatePath("/listings");
  redirect(`/listings/${listing.id}`);
}
