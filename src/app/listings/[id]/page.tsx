import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/listings";
import { walkDistanceLabel } from "@/lib/listingLabels";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import { breadcrumbLink, btnPrimary, btnSecondary, cardClass } from "@/lib/uiStyles";

type Props = { params: Promise<{ id: string }> };

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "medium",
    timeZone: "Asia/Jerusalem",
  }).format(d);
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: "מודעה לא נמצאה" };
  return { title: listing.title };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  return (
    <div className="px-4 pb-16 pt-8 sm:pt-10">
      <article className={`mx-auto max-w-2xl space-y-8 ${cardClass}`}>
        <nav className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
          <Link href="/listings" className={breadcrumbLink}>
            כל המודעות
          </Link>
        </nav>

        <h1 className="text-balance text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
          {listing.title}
        </h1>

        {listing.publisherEmail ? (
          <p className="text-xs text-stone-500 dark:text-stone-400">
            פורסם על ידי: <span className="font-medium text-stone-700 dark:text-stone-300">{listing.publisherEmail}</span>
          </p>
        ) : null}

        {listing.imageUrl ? (
          <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-inner dark:border-stone-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.imageUrl} alt="" className="max-h-80 w-full object-cover" />
          </div>
        ) : null}

        <p className="whitespace-pre-wrap text-pretty leading-relaxed text-stone-700 dark:text-stone-300">
          {listing.description}
        </p>

        <dl className="grid gap-4 rounded-2xl bg-stone-50/90 p-5 text-sm dark:bg-stone-800/50 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">מיקום</dt>
            <dd className="mt-1 text-base font-medium text-stone-900 dark:text-stone-50">
              {listing.city}
              {listing.neighborhood ? ` · ${listing.neighborhood}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">חדרים / מיטות</dt>
            <dd className="mt-1 text-base font-medium text-stone-900 dark:text-stone-50">
              {listing.rooms} / {listing.beds}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">מרחק מבית הכנסת</dt>
            <dd className="mt-1 font-medium text-stone-900 dark:text-stone-50">{walkDistanceLabel(listing.walkDistance)}</dd>
            <dd className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{SYNAGOGUE_ADDRESS_HE}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">זמינות</dt>
            <dd className="mt-1 font-medium text-stone-900 dark:text-stone-50">
              {fmtDate(listing.availableFrom)} – {fmtDate(listing.availableTo)}
            </dd>
          </div>
          {listing.askingPriceNis != null && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">מחיר מבוקש</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums text-stone-900 dark:text-stone-50">
                {listing.askingPriceNis.toLocaleString("he-IL")} ₪
              </dd>
            </div>
          )}
        </dl>

        <div className="rounded-2xl border border-teal-200/60 bg-teal-50/50 p-5 dark:border-teal-800/40 dark:bg-teal-950/30">
          <h2 className="text-sm font-bold text-teal-950 dark:text-teal-100">יצירת קשר</h2>
          <p className="mt-3 text-stone-800 dark:text-stone-200">
            טלפון:{" "}
            <a href={`tel:${listing.contactPhone}`} className="font-semibold text-teal-900 underline decoration-teal-400 underline-offset-2 hover:text-teal-700 dark:text-teal-200">
              {listing.contactPhone}
            </a>
          </p>
          {listing.contactWhatsapp ? (
            <p className="mt-2 text-stone-800 dark:text-stone-200">
              וואטסאפ:{" "}
              <a
                href={`https://wa.me/${listing.contactWhatsapp.replace(/\D/g, "")}`}
                className="font-semibold text-teal-900 underline decoration-teal-400 underline-offset-2 hover:text-teal-700 dark:text-teal-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {listing.contactWhatsapp}
              </a>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-stone-200/80 pt-6 dark:border-stone-700/80">
          <Link
            href={`/simulator?beds=${listing.beds}&rooms=${listing.rooms}&distance=${listing.walkDistance}`}
            className={btnPrimary}
          >
            סימולציית מחיר לפי תקנון
          </Link>
          <Link href="/listings" className={btnSecondary}>
            עוד מודעות
          </Link>
        </div>
      </article>
    </div>
  );
}
