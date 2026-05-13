import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { parseWalkDistance, walkDistanceLabel } from "@/lib/listingLabels";
import { findPublishedListings } from "@/lib/listings";
import { breadcrumbLink, btnPrimary, btnSecondary, hintClass, inputClass, labelClass, selectClass } from "@/lib/uiStyles";

export const metadata = {
  title: "מודעות דירות",
  description: "דירות להשכרה לחגים — לוח מודעות",
};

type SearchParams = {
  city?: string;
  walk?: string;
  from?: string;
  to?: string;
};

function parseYmd(s: string | undefined): Date | undefined {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const d = new Date(`${s}T12:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const city = sp.city?.trim() || undefined;
  const walkDistance = parseWalkDistance(sp.walk) ?? undefined;
  const availableFrom = parseYmd(sp.from);
  const availableTo = parseYmd(sp.to);

  const listings = await findPublishedListings({
    city,
    walkDistance,
    ...(availableFrom && availableTo ? { availableFrom, availableTo } : {}),
  });

  return (
    <div className="px-4 pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <nav className="text-sm">
          <Link href="/" className={breadcrumbLink}>
            דף הבית
          </Link>
        </nav>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">מודעות דירות</h1>
            <p className="text-stone-600 dark:text-stone-400">חיפוש לפי עיר, מרחק ותאריכי זמינות</p>
          </div>
          <Link href="/listings/new" className={`${btnPrimary} shrink-0 shadow-md shadow-teal-700/20`}>
            + פרסום מודעה
          </Link>
        </div>

        <form
          className="space-y-4 rounded-2xl border border-stone-200/90 bg-white/90 p-5 shadow-sm dark:border-stone-700/90 dark:bg-stone-900/70 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-4 sm:space-y-0"
          method="get"
          action="/listings"
        >
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="city">
              עיר (חיפוש חלקי)
            </label>
            <input
              id="city"
              name="city"
              defaultValue={city ?? ""}
              placeholder="למשל: גבעת זאב"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="walk">
              מרחק מבית הכנסת
            </label>
            <select id="walk" name="walk" defaultValue={walkDistance ?? ""} className={selectClass}>
              <option value="">הכל</option>
              <option value="upTo10">{walkDistanceLabel("upTo10")}</option>
              <option value="upTo20">{walkDistanceLabel("upTo20")}</option>
              <option value="over20">{walkDistanceLabel("over20")}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="from">
                זמינות מתאריך
              </label>
              <input id="from" name="from" type="date" defaultValue={sp.from ?? ""} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="to">
                עד תאריך
              </label>
              <input id="to" name="to" type="date" defaultValue={sp.to ?? ""} className={inputClass} />
            </div>
          </div>
          <p className={`${hintClass} sm:col-span-2`}>מודעה תוצג אם יש חפיפה בין טווח הזמינות שלה לבין התאריכים שבחרתם.</p>
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <button type="submit" className={btnPrimary}>
              חיפוש
            </button>
            <Link href="/listings" className={btnSecondary}>
              ניקוי סינון
            </Link>
          </div>
        </form>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-10 text-center dark:border-stone-600 dark:bg-stone-900/40">
            <p className="text-stone-600 dark:text-stone-400">אין מודעות שתואמות את החיפוש.</p>
            <Link href="/listings/new" className={`${btnPrimary} mt-5 inline-flex`}>
              פרסום המודעה הראשונה
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
