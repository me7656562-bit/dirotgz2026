import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { parseWalkDistance, walkDistanceLabel } from "@/lib/listingLabels";
import { findPublishedListings } from "@/lib/listings";
import { btnPrimary, btnSecondary, selectClass, labelClass } from "@/lib/uiStyles";

export const metadata = {
  title: "מודעות דירות — שבועות תשפ״ו",
  description: "דירות להשכרה לשבועות תשפ״ו — לוח מודעות גבעת זאב",
};

type SearchParams = { walk?: string; beds?: string };

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const walkDistance = parseWalkDistance(sp.walk) ?? undefined;
  const minBeds = sp.beds ? Math.max(1, Number(sp.beds) || 1) : undefined;

  const listings = await findPublishedListings({ walkDistance, minBeds });

  const hasFilter = !!(walkDistance || minBeds);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/60 via-white to-stone-50 dark:from-teal-950/30 dark:via-stone-950 dark:to-stone-950">
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-8">

        {/* כותרת */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
            🏡 שבועות תשפ״ו · גבעת זאב
          </div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
            לוח מודעות דירות
          </h1>
          <p className="mt-2 text-stone-500 dark:text-stone-400">מצא את הדירה המתאימה לחג</p>
        </div>

        {/* טופס חיפוש */}
        <form
          method="get"
          action="/listings"
          className="mb-8 overflow-hidden rounded-3xl border border-teal-200/80 bg-white shadow-lg shadow-teal-100/50 dark:border-teal-800/50 dark:bg-stone-900 dark:shadow-teal-900/20"
        >
          <div className="bg-gradient-to-l from-teal-600 to-teal-700 px-5 py-3">
            <p className="text-sm font-bold text-white">🔍 מצא לי התאמה</p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-5">
            <div>
              <label className={labelClass} htmlFor="walk">מרחק מבית הכנסת</label>
              <select id="walk" name="walk" defaultValue={walkDistance ?? ""} className={selectClass}>
                <option value="">כל המרחקים</option>
                <option value="upTo10">{walkDistanceLabel("upTo10")}</option>
                <option value="upTo20">{walkDistanceLabel("upTo20")}</option>
                <option value="over20">{walkDistanceLabel("over20")}</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="beds">מינימום מיטות</label>
              <select id="beds" name="beds" defaultValue={sp.beds ?? ""} className={selectClass}>
                <option value="">לא משנה</option>
                {[2, 3, 4, 5, 6, 7, 8, 10].map((n) => (
                  <option key={n} value={n}>{n}+ מיטות</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 border-t border-stone-100 px-5 pb-5 pt-3 dark:border-stone-800">
            <button type="submit" className={`${btnPrimary} flex-1`}>
              חפש התאמות
            </button>
            {hasFilter && (
              <Link href="/listings" className={btnSecondary}>
                נקה
              </Link>
            )}
          </div>
        </form>

        {/* תוצאות */}
        {hasFilter && (
          <div className={`mb-5 rounded-2xl px-5 py-3 text-sm font-semibold ${
            listings.length > 0
              ? "bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200"
              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          }`}>
            {listings.length > 0
              ? `🎉 מצאנו לך ${listings.length} ${listings.length === 1 ? "התאמה" : "התאמות"}!`
              : "😔 לא נמצאו דירות מתאימות — נסה להרחיב את החיפוש"}
          </div>
        )}

        {/* כפתור פרסום */}
        <div className="mb-6 flex justify-end">
          <Link href="/listings/new" className={`${btnPrimary} shadow-md shadow-teal-700/20`}>
            + פרסם מודעה
          </Link>
        </div>

        {listings.length === 0 && !hasFilter ? (
          <div className="rounded-3xl border-2 border-dashed border-teal-200 bg-white/60 p-12 text-center dark:border-teal-800/50 dark:bg-stone-900/40">
            <p className="text-4xl">🏠</p>
            <p className="mt-3 text-lg font-bold text-stone-700 dark:text-stone-300">אין מודעות עדיין</p>
            <p className="mt-1 text-sm text-stone-500">היה הראשון לפרסם!</p>
            <Link href="/listings/new" className={`${btnPrimary} mt-5 inline-flex`}>
              פרסום מודעה ראשונה
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {listings.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
