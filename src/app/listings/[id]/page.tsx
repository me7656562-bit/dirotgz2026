import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, BedDouble, DoorOpen, Footprints, CalendarDays,
  Phone, MessageCircle, Navigation, Check, X,
  Thermometer, Utensils, Clock, Bath, TreePine, Sofa, Layers
} from "lucide-react";
import { getListingById } from "@/lib/listings";
import { walkDistanceLabel } from "@/lib/listingLabels";
import { SYNAGOGUE_ADDRESS_HE, SYNAGOGUE_ADDRESS_QUERY } from "@/lib/synagogue";
import { breadcrumbLink, btnPrimary, btnSecondary, cardClass } from "@/lib/uiStyles";

type Props = { params: Promise<{ id: string }> };

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "medium",
    timeZone: "Asia/Jerusalem",
  }).format(d);
}

function BoolRow({ label, value, icon }: { label: string; value: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {icon && <span className="text-stone-400">{icon}</span>}
      <span className="text-stone-700 dark:text-stone-300">{label}</span>
      <span className="mr-auto">
        {value
          ? <Check className="h-4 w-4 text-teal-600" />
          : <X className="h-4 w-4 text-stone-300 dark:text-stone-600" />
        }
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">{label}</dt>
      <dd className="mt-0.5 font-medium text-stone-900 dark:text-stone-50">{value}</dd>
    </div>
  );
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

  const mapsUrl = listing.address
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(SYNAGOGUE_ADDRESS_QUERY)}&destination=${encodeURIComponent(`${listing.address}, ${listing.city}`)}&travelmode=walking`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.city} ${listing.neighborhood ?? ""}`)}`;

  return (
    <div className="px-4 pb-16 pt-8 sm:pt-10">
      <article className={`mx-auto max-w-2xl space-y-8 ${cardClass}`}>

        {/* breadcrumb */}
        <nav className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
          <Link href="/listings" className={breadcrumbLink}>כל המודעות</Link>
        </nav>

        {/* כותרת + מחיר */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
            {listing.title}
          </h1>
          {listing.askingPriceNis != null && (
            <span className="shrink-0 rounded-2xl bg-teal-50 px-4 py-2 text-xl font-bold text-teal-800 ring-1 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-200 dark:ring-teal-800">
              {listing.askingPriceNis.toLocaleString("he-IL")} ₪
            </span>
          )}
        </div>

        {/* תמונה */}
        {listing.imageUrl ? (
          <div className="overflow-hidden rounded-2xl border border-stone-200 shadow-inner dark:border-stone-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.imageUrl} alt="" className="max-h-80 w-full object-cover" />
          </div>
        ) : null}

        {/* תיאור */}
        {listing.description ? (
          <p className="whitespace-pre-wrap text-pretty leading-relaxed text-stone-700 dark:text-stone-300">
            {listing.description}
          </p>
        ) : null}

        {/* מיקום + גוגל מפות */}
        <div className="rounded-2xl bg-stone-50/90 p-5 dark:bg-stone-800/50">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-teal-900 dark:text-teal-200">
            <MapPin className="h-4 w-4" /> מיקום
          </h2>
          <dl className="space-y-2 text-sm">
            <InfoRow label="עיר / שכונה" value={`${listing.city}${listing.neighborhood ? ` · ${listing.neighborhood}` : ""}`} />
            {listing.address && <InfoRow label="כתובת מדויקת" value={listing.address} />}
            {listing.floor != null && <InfoRow label="קומה" value={listing.floor === 0 ? "קרקע" : listing.floor} />}
            <InfoRow label="מרחק מבית הכנסת" value={walkDistanceLabel(listing.walkDistance)} />
            <dd className="text-xs text-stone-500 dark:text-stone-400">{SYNAGOGUE_ADDRESS_HE}</dd>
          </dl>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Navigation className="h-4 w-4" />
            {listing.address ? "הוראות הליכה מבית הכנסת (גוגל מפות)" : "פתח בגוגל מפות"}
          </a>
        </div>

        {/* שינה */}
        <div className="rounded-2xl bg-stone-50/90 p-5 dark:bg-stone-800/50">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-teal-900 dark:text-teal-200">
            <BedDouble className="h-4 w-4" /> חדרים ושינה
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <InfoRow label="חדרים סגורים" value={listing.rooms ? `${listing.rooms} חדרים` : null} />
            <InfoRow label="סה״כ מיטות" value={listing.beds ? `${listing.beds} מיטות` : null} />
            {listing.bedsDouble != null && <InfoRow label="מיטות זוגיות" value={listing.bedsDouble} />}
            {listing.bedsJewish != null && <InfoRow label="מיטות יהודיות" value={listing.bedsJewish} />}
            {listing.mattresses != null && <InfoRow label="מזרונים" value={listing.mattresses} />}
            {listing.cribs != null && <InfoRow label="עריסות / לולים" value={listing.cribs} />}
          </dl>
          <div className="mt-3 space-y-2 border-t border-stone-200/80 pt-3 dark:border-stone-700/80">
            <BoolRow label="ספה נפתחת" value={listing.sofa} icon={<Sofa className="h-3.5 w-3.5" />} />
            <BoolRow label="מצעים" value={listing.bedLinens} icon={<Layers className="h-3.5 w-3.5" />} />
          </div>
        </div>

        {/* ציוד שבת */}
        <div className="rounded-2xl bg-stone-50/90 p-5 dark:bg-stone-800/50">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-teal-900 dark:text-teal-200">
            <Clock className="h-4 w-4" /> ציוד שבת וחג
          </h2>
          <div className="space-y-2">
            <BoolRow label="מזגן מרכזי" value={listing.ac} icon={<Thermometer className="h-3.5 w-3.5" />} />
            <BoolRow label="פלטה לשבת" value={listing.shabbatPlate} icon={<Utensils className="h-3.5 w-3.5" />} />
            <BoolRow label="מיחם שבת" value={listing.shabbatUrnBoiler} icon={<Utensils className="h-3.5 w-3.5" />} />
            <BoolRow label="שעון שבת" value={listing.shabbatClock} icon={<Clock className="h-3.5 w-3.5" />} />
          </div>
        </div>

        {/* שירותים, מרפסת וסלון */}
        <div className="rounded-2xl bg-stone-50/90 p-5 dark:bg-stone-800/50">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-teal-900 dark:text-teal-200">
            <DoorOpen className="h-4 w-4" /> סלון, מרפסת ועוד
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {listing.bathrooms != null && (
              <InfoRow label="שירותים / חדרי רחצה" value={
                <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5 text-stone-400" />{listing.bathrooms}</span>
              } />
            )}
            {listing.balconyType && (
              <InfoRow label="מרפסת / חצר" value={
                <span className="flex items-center gap-1"><TreePine className="h-3.5 w-3.5 text-stone-400" />{listing.balconyType}{listing.balconySize ? ` (${listing.balconySize})` : ""}</span>
              } />
            )}
            {listing.livingRoomSize && <InfoRow label="גודל סלון" value={listing.livingRoomSize} />}
            {listing.diningTable && <InfoRow label="שולחן אוכל" value={listing.diningTable} />}
            {listing.chairs && <InfoRow label="כסאות" value={listing.chairs} />}
          </dl>
        </div>

        {/* זמינות */}
        <div className="flex items-center gap-2 rounded-xl bg-teal-50/70 px-4 py-3 text-sm dark:bg-teal-950/30">
          <CalendarDays className="h-4 w-4 text-teal-600" />
          <span className="font-medium text-teal-900 dark:text-teal-200">
            זמינות: {fmtDate(listing.availableFrom)} – {fmtDate(listing.availableTo)}
          </span>
        </div>

        {/* יצירת קשר */}
        <div className="rounded-2xl border border-teal-200/60 bg-teal-50/50 p-5 dark:border-teal-800/40 dark:bg-teal-950/30">
          <h2 className="mb-3 text-sm font-bold text-teal-950 dark:text-teal-100">יצירת קשר</h2>
          <div className="space-y-2">
            <a href={`tel:${listing.contactPhone}`} className="flex items-center gap-2 text-sm font-semibold text-teal-900 underline-offset-2 hover:underline dark:text-teal-200">
              <Phone className="h-4 w-4" />
              {listing.contactPhone}
            </a>
            {listing.contactWhatsapp ? (
              <a
                href={`https://wa.me/${listing.contactWhatsapp.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-sm font-semibold text-teal-900 underline-offset-2 hover:underline dark:text-teal-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                וואטסאפ: {listing.contactWhatsapp}
              </a>
            ) : null}
          </div>
        </div>

        {/* כפתורים */}
        <div className="flex flex-wrap gap-3 border-t border-stone-200/80 pt-6 dark:border-stone-700/80">
          <Link
            href={`/simulator?beds=${listing.beds}&rooms=${listing.rooms}&distance=${listing.walkDistance}`}
            className={btnPrimary}
          >
            <Footprints className="h-4 w-4" />
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
