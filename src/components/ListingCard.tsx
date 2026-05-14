import Link from "next/link";
import { MapPin, BedDouble, DoorOpen, Footprints } from "lucide-react";
import { walkDistanceLabel } from "@/lib/listingLabels";
import type { WalkDistance } from "@prisma/client";

type ListingWithImage = {
  id: string;
  title: string;
  rooms: number;
  beds: number;
  walkDistance: WalkDistance;
  askingPriceNis: number | null;
  address: string | null;
  floor: number | null;
  ac: boolean;
  shabbatPlate: boolean;
  sofa: boolean;
  imageUrl: string | null;
  images?: { url: string }[];
};

const distanceColor: Record<string, string> = {
  upTo10: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  upTo20: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  over20: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
};

export function ListingCard({ listing }: { listing: ListingWithImage }) {
  const distCls = distanceColor[listing.walkDistance] ?? "bg-stone-100 text-stone-700";
  const heroImage = listing.images?.[0]?.url ?? listing.imageUrl ?? null;

  return (
    <article className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-md shadow-stone-200/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-900/10 dark:border-stone-700/80 dark:bg-stone-900 dark:shadow-black/30">
      <Link href={`/listings/${listing.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">

        {/* תמונה ראשית או פס צבע */}
        {heroImage ? (
          <div className="relative h-44 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {listing.askingPriceNis != null && (
              <div className="absolute bottom-3 left-3 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 px-3 py-1.5 shadow-md">
                <span className="block text-base font-black tabular-nums text-white leading-none">
                  {listing.askingPriceNis.toLocaleString("he-IL")} ₪
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-1.5 w-full bg-gradient-to-l from-teal-400 via-cyan-400 to-teal-600" />
        )}

        <div className="p-5">
          {/* כותרת + מחיר (אם אין תמונה) */}
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-black leading-snug text-stone-900 transition group-hover:text-teal-700 dark:text-stone-50 dark:group-hover:text-teal-300">
              {listing.title}
            </h2>
            {!heroImage && listing.askingPriceNis != null && (
              <div className="shrink-0 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 px-3.5 py-1.5 text-center shadow-sm shadow-teal-600/30">
                <span className="block text-base font-black tabular-nums text-white leading-none">
                  {listing.askingPriceNis.toLocaleString("he-IL")} ₪
                </span>
                <span className="text-[10px] font-medium text-teal-100">לשבועות</span>
              </div>
            )}
          </div>

          {/* תגיות */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              <DoorOpen className="h-3.5 w-3.5 text-teal-500" />
              {listing.rooms} חדרים
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <BedDouble className="h-3.5 w-3.5" />
              {listing.beds} מיטות
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${distCls}`}>
              <Footprints className="h-3.5 w-3.5" />
              {walkDistanceLabel(listing.walkDistance)}
            </span>
            {listing.ac && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                ❄️ מזגן
              </span>
            )}
            {listing.shabbatPlate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                🍲 פלטה
              </span>
            )}
            {listing.sofa && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                🛋️ ספה
              </span>
            )}
          </div>

          {/* כתובת */}
          {listing.address && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <MapPin className="h-3 w-3 shrink-0 text-rose-400" />
              {listing.address}
              {listing.floor != null && listing.floor !== 0 && ` · קומה ${listing.floor}`}
              {listing.floor === 0 && " · קרקע"}
            </p>
          )}
        </div>

        {/* חץ */}
        <div className="flex items-center justify-between border-t border-stone-100 bg-gradient-to-l from-teal-50/50 to-white px-5 py-2.5 dark:border-stone-800 dark:from-teal-950/20 dark:to-stone-900">
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">לפרטים מלאים ›</span>
          <span className="text-lg">🏡</span>
        </div>
      </Link>
    </article>
  );
}
