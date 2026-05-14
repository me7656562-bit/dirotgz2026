"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { updateListingAction, type ListingFormState } from "@/app/actions/listings";
import { Toggle } from "@/components/Toggle";
import { Num } from "@/components/Num";
import { ImageUpload, type UploadedImage } from "@/components/ImageUpload";
import { 
  type WalkDistance,
  computeShavuot5786Total,
} from "@/lib/pricing/shavuot5786StolinKarlin";
import { btnPrimary, btnSecondary, inputClass, labelClass, selectClass } from "@/lib/uiStyles";
import type { ListingModel } from "@/generated/prisma/models";

type Props = {
  listing: ListingModel & { images?: { url: string; publicId?: string | null }[] };
};

export function EditListingForm({ listing }: Props) {
  const router = useRouter();
  
  const [state, formAction] = useActionState<ListingFormState, FormData>(
    updateListingAction, 
    null
  );

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    listing.images?.map((img) => ({ url: img.url, publicId: img.publicId ?? "" })) ?? []
  );
  const uploadedUrls = uploadedImages.map((img) => img.url);

  useEffect(() => {
    if (state?.ok && state.listingId) {
      router.push(`/listings/${state.listingId}`);
    }
  }, [state, router]);

  // State variables populated with existing listing data
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description || "");
  const [neighborhood, setNeighborhood] = useState(listing.neighborhood || "");
  const [address, setAddress] = useState(listing.address || "");
  const [floor, setFloor] = useState(listing.floor || 0);
  const [contactPhone, setContactPhone] = useState(listing.contactPhone);
  const [contactWhatsapp, setContactWhatsapp] = useState(listing.contactWhatsapp || "");

  const [rooms, setRooms] = useState(listing.rooms);
  const [roomsClosed, setRoomsClosed] = useState(listing.roomsClosed || 0);
  const [bedsDouble, setBedsDouble] = useState(listing.bedsDouble || 0);
  const [bedsJewish, setBedsJewish] = useState(listing.bedsJewish || 0);
  const [mattresses, setMattresses] = useState(listing.mattresses || 0);
  const [renterMattresses, setRenterMattresses] = useState(0);
  const [cribs, setCribs] = useState(listing.cribs || 0);
  const [bathrooms, setBathrooms] = useState(listing.bathrooms || 1);

  const [walkDistance, setWalkDistance] = useState<WalkDistance | "">(listing.walkDistance || "");
  const [ac, setAc] = useState(listing.ac);
  const [shabbatPlate, setShabbatPlate] = useState(listing.shabbatPlate);
  const [shabbatUrn, setShabbatUrn] = useState(listing.shabbatUrnBoiler);
  const [shabbatClock, setShabbatClock] = useState(listing.shabbatClock);
  const [sofa, setSofa] = useState(listing.sofa);
  const [bedLinens, setBedLinens] = useState(listing.bedLinens);
  const [kosherKitchen, setKosherKitchen] = useState(listing.kosherKitchen || false);
  const [chairsCount, setChairsCount] = useState(listing.chairsCount || 0);

  const [balconyType, setBalconyType] = useState(listing.balconyType || "");
  const [balconySize, setBalconySize] = useState(listing.balconySize || "");
  const [livingRoomSize, setLivingRoomSize] = useState(listing.livingRoomSize || "");
  const [diningTable, setDiningTable] = useState(listing.diningTable || "");

  // Simulate price calculation for total beds
  const totalBeds = bedsDouble + bedsJewish;
  const priceResult = useMemo(() => {
    if (!walkDistance || totalBeds < 2) return null;
    return computeShavuot5786Total(
      totalBeds,
      walkDistance as WalkDistance,
      rooms,
      {
        missingBasicItem: false,
        notFullAirConditioning: !ac,
        landlordMattresses: mattresses,
        renterMattresses,
      }
    );
  }, [totalBeds, walkDistance, rooms, ac, mattresses, renterMattresses]);

  const handleImageChange = useCallback((imgs: UploadedImage[]) => {
    setUploadedImages(imgs);
  }, []);

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden field for listing ID */}
      <input type="hidden" name="listingId" value={listing.id} />
      <input type="hidden" name="uploadedImages" value={JSON.stringify(uploadedUrls)} />

      {state?.message && (
        <div className={`rounded-2xl px-4 py-3 text-sm ${
          state.ok 
            ? "bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/40 dark:text-green-200 dark:border-green-800/40"
            : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800/40"
        }`}>
          {state.message}
        </div>
      )}

      {/* ── כותרת ותיאור ── */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-teal-500 to-emerald-500 px-5 py-2.5">
          <p className="text-sm font-bold text-white">📝 כותרת ותיאור</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="title" className={labelClass}>כותרת המודעה *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="דירה נעימה וכשרה לחג השבועות"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>תיאור נוסף (אופציונלי)</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="תיאור חופשי של הדירה..."
            />
          </div>
        </div>
      </section>

      {/* ── מיקום ── */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-rose-500 to-pink-500 px-5 py-2.5">
          <p className="text-sm font-bold text-white">📍 מיקום</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="neighborhood" className={labelClass}>שכונה</label>
              <input
                type="text"
                id="neighborhood" 
                name="neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className={inputClass}
                placeholder="הר נוף, גבעת האילנות..."
              />
            </div>
            <div>
              <label htmlFor="address" className={labelClass}>כתובת מדויקת</label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
                placeholder="רחוב הפיקוס 15"
              />
            </div>
            <div>
              <label htmlFor="floor" className={labelClass}>קומה</label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className={inputClass}
                min={-2}
                max={20}
              />
            </div>
            <div>
              <label htmlFor="walkDistance" className={labelClass}>מרחק הליכה מבית הכנסת *</label>
              <select
                id="walkDistance"
                name="walkDistance"
                value={walkDistance}
                onChange={(e) => setWalkDistance(e.target.value as WalkDistance | "")}
                className={selectClass}
                required
              >
                <option value="">בחר מרחק</option>
                <option value="upTo10">עד 10 דקות הליכה</option>
                <option value="upTo20">עד 20 דקות הליכה</option>
                <option value="over20">מעל 20 דקות הליכה</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── תמונות ── */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-indigo-500 to-purple-500 px-5 py-2.5">
          <p className="text-sm font-bold text-white">📸 תמונות</p>
        </div>
        <div className="p-5">
          <ImageUpload onChange={handleImageChange} maxFiles={6} />
        </div>
      </section>

      {/* ── חדרים וציוד ── */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-blue-600 to-indigo-600 px-5 py-2.5">
          <p className="text-sm font-bold text-white">🛏️ חדרים, שינה וציוד</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <Num name="rooms" label="סה״כ חדרים" value={rooms} onChange={setRooms} min={1} />
            <Num name="roomsClosed" label="חדרים סגורים" value={roomsClosed} onChange={setRoomsClosed} min={0} max={rooms} />
            <Num name="bedsDouble" label="מיטות כפולות" value={bedsDouble} onChange={setBedsDouble} />
            <Num name="bedsJewish" label="מיטות יהודיות" value={bedsJewish} onChange={setBedsJewish} />
            <Num name="mattresses" label="מזרונים (משכיר)" value={mattresses} onChange={setMattresses} />
            <Num name="cribs" label="עריסות / לולים" value={cribs} onChange={setCribs} />
            <Num name="bathrooms" label="שירותים/אמבטיות" value={bathrooms} onChange={setBathrooms} min={1} />
            <Num name="chairsCount" label="מספר כסאות" value={chairsCount} onChange={setChairsCount} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-stone-100 pt-4 dark:border-stone-800">
            <Toggle name="ac" label="מזגן" emoji="❄️" checked={ac} onChange={setAc} />
            <Toggle name="shabbatPlate" label="פלטה" emoji="🍲" checked={shabbatPlate} onChange={setShabbatPlate} />
            <Toggle name="shabbatUrnBoiler" label="מיחם שבת" emoji="☕" checked={shabbatUrn} onChange={setShabbatUrn} />
            <Toggle name="shabbatClock" label="שעון שבת" emoji="⏰" checked={shabbatClock} onChange={setShabbatClock} />
            <Toggle name="sofa" label="ספה נפתחת" emoji="🛋️" checked={sofa} onChange={setSofa} />
            <Toggle name="bedLinens" label="מצעים" emoji="🛏️" checked={bedLinens} onChange={setBedLinens} />
            <Toggle name="kosherKitchen" label="מטבח כשר" emoji="🍽️" checked={kosherKitchen} onChange={setKosherKitchen} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
            <div>
              <label htmlFor="balconyType" className={labelClass}>מרפסת / חצר</label>
              <select
                id="balconyType"
                name="balconyType"
                value={balconyType}
                onChange={(e) => setBalconyType(e.target.value)}
                className={selectClass}
              >
                <option value="">אין</option>
                <option value="מרפסת">מרפסת</option>
                <option value="גינה">גינה</option>
                <option value="חצר">חצר</option>
              </select>
            </div>
            <div>
              <label htmlFor="diningTable" className={labelClass}>שולחן אוכל</label>
              <select
                id="diningTable"
                name="diningTable"
                value={diningTable}
                onChange={(e) => setDiningTable(e.target.value)}
                className={selectClass}
              >
                <option value="">אין</option>
                <option value="שולחן מטבח">מטבח</option>
                <option value="שולחן רגיל">רגיל</option>
                <option value="שולחן גדול">גדול</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── מחיר לפי תקנון ── */}
      {priceResult && (
        <section className="overflow-hidden rounded-3xl border border-amber-300/70 shadow-lg shadow-amber-200/40 dark:border-amber-700/50">
          <div className="bg-gradient-to-l from-amber-500 to-orange-500 px-5 py-2.5">
            <p className="text-sm font-bold text-white">💰 מחיר מומלץ לפי תקנון המרכז</p>
          </div>
          <div className="space-y-1.5 p-4">
            {priceResult.lines.map((line) => (
              <div key={line.label} className="flex justify-between gap-3 text-sm">
                <span className="text-stone-600 dark:text-stone-400">{line.label}</span>
                <span className={`tabular-nums font-semibold ${
                  line.amount < 0 ? "text-red-600" : "text-stone-800 dark:text-stone-100"
                }`}>
                  {line.amount > 0 ? "+" : ""}{line.amount.toLocaleString("he-IL")} ₪
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-gradient-to-l from-amber-500 to-orange-500 px-5 py-4">
            <span className="text-lg font-bold text-white">מחיר מומלץ לכל התקופה</span>
            <span className="text-3xl font-black tabular-nums text-white">
              {priceResult.total.toLocaleString("he-IL")} ₪
            </span>
          </div>
          <input type="hidden" name="askingPriceNis" value={priceResult.total} />
        </section>
      )}

      {/* ── יצירת קשר ── */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-green-500 to-teal-500 px-5 py-2.5">
          <p className="text-sm font-bold text-white">📞 יצירת קשר</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contactPhone" className={labelClass}>טלפון *</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={inputClass}
                placeholder="052-1234567"
                required
              />
            </div>
            <div>
              <label htmlFor="contactWhatsapp" className={labelClass}>וואטסאפ (אופציונלי)</label>
              <input
                type="tel"
                id="contactWhatsapp"
                name="contactWhatsapp"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className={inputClass}
                placeholder="052-1234567"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── כפתורים ── */}
      <div className="flex gap-4 justify-center">
        <Link href={`/listings/${listing.id}`} className={btnSecondary}>
          ביטול
        </Link>
        <button
          type="submit"
          className={btnPrimary}
          disabled={!walkDistance || totalBeds < 2}
        >
          💾 שמור שינויים
        </button>
      </div>
    </form>
  );
}