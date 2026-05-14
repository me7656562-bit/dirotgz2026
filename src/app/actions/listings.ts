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

function getInt(fd: FormData, key: string): number | null {
  const v = String(fd.get(key) ?? "").trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function getBool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true" || fd.get(key) === "1";
}

function getStr(fd: FormData, key: string): string | null {
  const v = String(fd.get(key) ?? "").trim();
  return v || null;
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
  const description = getStr(formData, "description");
  const city = String(formData.get("city") ?? "").trim();
  const neighborhood = getStr(formData, "neighborhood");
  const address = getStr(formData, "address");
  const floor = getInt(formData, "floor");
  const rooms = Number(formData.get("rooms"));
  const beds = Number(formData.get("beds"));
  const bedsDouble = getInt(formData, "bedsDouble");
  const bedsJewish = getInt(formData, "bedsJewish");
  const mattresses = getInt(formData, "mattresses");
  const cribs = getInt(formData, "cribs");
  const sofa = getBool(formData, "sofa");
  const bedLinens = getBool(formData, "bedLinens");
  const ac = getBool(formData, "ac");
  const shabbatPlate = getBool(formData, "shabbatPlate");
  const shabbatUrnBoiler = getBool(formData, "shabbatUrnBoiler");
  const shabbatClock = getBool(formData, "shabbatClock");
  const bathrooms = getInt(formData, "bathrooms");
  const balconyType = getStr(formData, "balconyType");
  const balconySize = getStr(formData, "balconySize");
  const livingRoomSize = getStr(formData, "livingRoomSize");
  const diningTable = getStr(formData, "diningTable");
  const chairs = getStr(formData, "chairs");
  const walkRaw = String(formData.get("walkDistance") ?? "");
  const walkDistance = parseWalkDistance(walkRaw);
  const availableFrom = parseDateOnly(String(formData.get("availableFrom") ?? ""));
  const availableTo = parseDateOnly(String(formData.get("availableTo") ?? ""));
  const askingRaw = String(formData.get("askingPriceNis") ?? "").trim();
  const askingPriceNis =
    askingRaw === "" ? null : Number.isFinite(Number(askingRaw)) ? Math.round(Number(askingRaw)) : null;
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const contactWhatsapp = getStr(formData, "contactWhatsapp");
  const imageUrl = getStr(formData, "imageUrl");

  if (title.length < 3) return { ok: false, message: "כותרת קצרה מדי (לפחות 3 תווים)." };
  if (!city) return { ok: false, message: "יש למלא עיר." };
  if (!Number.isInteger(rooms) || rooms < 1 || rooms > 30) {
    return { ok: false, message: "מספר חדרים לא תקין." };
  }
  if (!Number.isInteger(beds) || beds < 0 || beds > 50) {
    return { ok: false, message: "מספר מיטות לא תקין." };
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
      description: description ?? "",
      city,
      neighborhood,
      address,
      floor,
      rooms,
      beds,
      bedsDouble,
      bedsJewish,
      mattresses,
      cribs,
      sofa,
      bedLinens,
      ac,
      shabbatPlate,
      shabbatUrnBoiler,
      shabbatClock,
      bathrooms,
      balconyType,
      balconySize,
      livingRoomSize,
      diningTable,
      chairs,
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
