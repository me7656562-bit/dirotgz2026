import Link from "next/link";
import { MapPin, BedDouble, DoorOpen, Footprints, CalendarDays, Banknote, ChevronLeft } from "lucide-react";
import type { ListingModel } from "@/generated/prisma/models/Listing";
import { walkDistanceLabel } from "@/lib/listingLabels";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "medium",
    timeZone: "Asia/Jerusalem",
  }).format(d);
}

export function ListingCard({ listing }: { listing: ListingModel }) {
  return (
    <article className="group rounded-2xl border border-stone-200/90 bg-white/95 shadow-sm shadow-stone-200/30 transition hover:border-teal-300/80 hover:shadow-md hover:shadow-teal-900/5 dark:border-stone-700/90 dark:bg-stone-900/80 dark:shadow-black/20 dark:hover:border-teal-700/50">
      <Link href={`/listings/${listing.id}`} className="block focus-visible:outline-offset-4">

        {/* כותרת */}
        <div className="flex items-start justify-between gap-3 p-5 pb-3">
          <h2 className="text-lg font-bold text-stone-900 transition group-hover:text-teal-800 dark:text-stone-50 dark:group-hover:text-teal-300">
            {listing.title}
          </h2>
          {listing.askingPriceNis != null && (
            <span className="shrink-0 rounded-xl bg-teal-50 px-3 py-1 text-sm font-bold text-teal-800 ring-1 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-200 dark:ring-teal-800">
              {listing.askingPriceNis.toLocaleString("he-IL")} ₪
            </span>
          )}
        </div>

        {/* תיאור */}
        <p className="line-clamp-2 px-5 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          {listing.description}
        </p>

        {/* פרטים */}
        <div className="mt-3 flex flex-wrap gap-2 px-5 pb-4 text-xs text-stone-600 dark:text-stone-400">
          <span className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 dark:bg-stone-800">
            <MapPin className="h-3 w-3 text-stone-400" />
            {listing.city}{listing.neighborhood ? ` · ${listing.neighborhood}` : ""}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 dark:bg-stone-800">
            <DoorOpen className="h-3 w-3 text-stone-400" />
            {listing.rooms} חדרים
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 dark:bg-stone-800">
            <BedDouble className="h-3 w-3 text-stone-400" />
            {listing.beds} מיטות
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 dark:bg-stone-800">
            <Footprints className="h-3 w-3 text-stone-400" />
            {walkDistanceLabel(listing.walkDistance)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 dark:bg-stone-800">
            <CalendarDays className="h-3 w-3 text-stone-400" />
            {fmtDate(listing.availableFrom)} – {fmtDate(listing.availableTo)}
          </span>
        </div>

        {/* חץ */}
        <div className="flex items-center justify-start gap-1 border-t border-stone-100 px-5 py-2.5 text-xs font-medium text-teal-700 transition group-hover:text-teal-800 dark:border-stone-800 dark:text-teal-400">
          <ChevronLeft className="h-3.5 w-3.5" />
          לפרטים מלאים
        </div>

      </Link>
    </article>
  );
}
