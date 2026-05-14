"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { parseWalkDistance } from "@/lib/listingLabels";

/** שמור תמונות Cloudinary למודעה קיימת */
export async function saveListingImagesAction(
  listingId: string,
  images: { url: string; publicId: string }[]
): Promise<void> {
  if (!images.length) return;
  await prisma.listingImage.createMany({
    data: images.map((img, i) => ({
      listingId,
      url: img.url,
      publicId: img.publicId,
      order: i,
    })),
    skipDuplicates: true,
  });
  revalidatePath(`/listings/${listingId}`);
}

export type ListingFormState =
  | { ok: true; listingId: string }
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

  // יצירת קוד רנדומלי 4 ספרות
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  const title = String(formData.get("title") ?? "").trim();
  const description = getStr(formData, "description");
  const city = String(formData.get("city") ?? "").trim() || "גבעת זאב";
  const neighborhood = getStr(formData, "neighborhood");
  const address = getStr(formData, "address");
  const floor = getInt(formData, "floor");
  const rooms = Number(formData.get("rooms"));
  const roomsClosed = getInt(formData, "roomsClosed");
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
  const kosherKitchen = getBool(formData, "kosherKitchen");
  const bathrooms = getInt(formData, "bathrooms");
  const balconyType = getStr(formData, "balconyType");
  const balconySize = getStr(formData, "balconySize");
  const livingRoomSize = getStr(formData, "livingRoomSize");
  const diningTable = getStr(formData, "diningTable");
  const chairs = getStr(formData, "chairs");
  const chairsCount = getInt(formData, "chairsCount");
  const walkRaw = String(formData.get("walkDistance") ?? "");
  const walkDistance = parseWalkDistance(walkRaw);
  // תאריכי שבועות תשפ"ו — ברירת מחדל אם לא הוזנו
  const availableFrom = parseDateOnly(String(formData.get("availableFrom") ?? "")) ?? new Date("2025-06-01T00:00:00Z");
  const availableTo = parseDateOnly(String(formData.get("availableTo") ?? "")) ?? new Date("2025-06-03T23:59:59Z");
  const askingRaw = String(formData.get("askingPriceNis") ?? "").trim();
  const askingPriceNis =
    askingRaw === "" ? null : Number.isFinite(Number(askingRaw)) ? Math.round(Number(askingRaw)) : null;
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const contactWhatsapp = getStr(formData, "contactWhatsapp");
  const imageUrl = getStr(formData, "imageUrl");

  if (title.length < 3) return { ok: false, message: "כותרת קצרה מדי (לפחות 3 תווים)." };
  if (!Number.isInteger(rooms) || rooms < 1 || rooms > 30) {
    return { ok: false, message: "מספר חדרים לא תקין." };
  }
  if (!Number.isInteger(beds) || beds < 0 || beds > 50) {
    return { ok: false, message: "מספר מיטות לא תקין." };
  }
  if (!walkDistance) return { ok: false, message: "יש לבחור קטגוריית מרחק." };
  if (!contactPhone || contactPhone.length < 8) {
    return { ok: false, message: "יש למלא מספר טלפון ליצירת קשר." };
  }
  if (askingPriceNis !== null && (askingPriceNis < 0 || askingPriceNis > 1_000_000)) {
    return { ok: false, message: "מחיר מבוקש לא סביר." };
  }

  const listing = await prisma.listing.create({
    data: {
    data: {
      code,
      title,
      description: description ?? "",
      city,
      neighborhood,
      address,
      floor,
      rooms,
      roomsClosed,
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
      kosherKitchen,
      bathrooms,
      balconyType,
      balconySize,
      livingRoomSize,
      diningTable,
      chairs,
      chairsCount,
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
  // מחזיר את ה-ID כדי שהלקוח יוכל להעלות תמונות ואז לעשות redirect
  return { ok: true, listingId: listing.id };
}

export async function updateListingAction(
  _prev: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, message: "יש להתחבר עם גוגל כדי לערוך מודעה." };
  }

  const listingId = String(formData.get("listingId") ?? "").trim();
  if (!listingId) {
    return { ok: false, message: "מזהה מודעה חסר." };
  }

  // בדיקת בעלות
  const existingListing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { publisherEmail: true }
  });

  if (!existingListing || existingListing.publisherEmail !== session.user.email) {
    return { ok: false, message: "אין הרשאה לערוך מודעה זו." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = getStr(formData, "description");
  const neighborhood = getStr(formData, "neighborhood");
  const address = getStr(formData, "address");
  const floor = getInt(formData, "floor");
  const rooms = Number(formData.get("rooms"));
  const roomsClosed = getInt(formData, "roomsClosed");
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
  const kosherKitchen = getBool(formData, "kosherKitchen");
  const bathrooms = getInt(formData, "bathrooms");
  const chairsCount = getInt(formData, "chairsCount");
  const balconyType = getStr(formData, "balconyType");
  const balconySize = getStr(formData, "balconySize");
  const livingRoomSize = getStr(formData, "livingRoomSize");
  const diningTable = getStr(formData, "diningTable");
  const walkRaw = String(formData.get("walkDistance") ?? "");
  const walkDistance = parseWalkDistance(walkRaw);
  const askingRaw = String(formData.get("askingPriceNis") ?? "").trim();
  const askingPriceNis = askingRaw === "" ? null : Number.isFinite(Number(askingRaw)) ? Math.round(Number(askingRaw)) : null;
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const contactWhatsapp = getStr(formData, "contactWhatsapp");

  // Handle uploaded images
  const uploadedImagesRaw = String(formData.get("uploadedImages") ?? "[]");
  let uploadedImages: string[] = [];
  try {
    uploadedImages = JSON.parse(uploadedImagesRaw);
  } catch {
    return { ok: false, message: "שגיאה בעיבוד התמונות." };
  }

  if (title.length < 3) return { ok: false, message: "כותרת קצרה מדי (לפחות 3 תווים)." };
  if (!walkDistance) return { ok: false, message: "יש לבחור מרחק הליכה." };
  if (contactPhone.length < 8) return { ok: false, message: "טלפון קצר מדי." };

  try {
    await prisma.$transaction(async (tx) => {
      // עדכון המודעה
      await tx.listing.update({
        where: { id: listingId },
        data: {
          title,
          description: description ?? "",
          neighborhood,
          address,
          floor,
          rooms,
          roomsClosed,
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
          kosherKitchen,
          bathrooms,
          chairsCount,
          balconyType,
          balconySize,
          livingRoomSize,
          diningTable,
          walkDistance,
          askingPriceNis: askingPriceNis ?? undefined,
          contactPhone,
          contactWhatsapp,
        }
      });

      // עדכון תמונות
      await tx.listingImage.deleteMany({ where: { listingId } });
      if (uploadedImages.length > 0) {
        await tx.listingImage.createMany({
          data: uploadedImages.map((url, i) => ({
            listingId,
            url,
            order: i,
          })),
        });
      }
    });

    revalidatePath(`/listings/${listingId}`);
    revalidatePath("/listings");

    return { ok: true, message: "המודעה עודכנה בהצלחה!" };
  } catch (error) {
    console.error("Error updating listing:", error);
    return { ok: false, message: "שגיאה בעדכון המודעה. נסה שוב." };
  }
}
