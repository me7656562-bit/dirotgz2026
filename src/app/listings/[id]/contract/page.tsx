import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getListingById } from "@/lib/listings";
import { walkDistanceLabel } from "@/lib/listingLabels";
import { breadcrumbLink, btnSecondary } from "@/lib/uiStyles";
import { auth } from "@/auth";
import { ContractActions } from "@/components/ContractActions";

type Props = { params: Promise<{ id: string }> };

export default async function ContractPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);
  
  if (!listing) {
    notFound();
  }

  const session = await auth();
  const isOwner = session?.user?.email === listing.publisherEmail;

  // רק בעל המודעה יכול לגשת לחוזה
  if (!isOwner) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <h1 className="text-xl font-bold text-red-600 mb-4">אין הרשאה</h1>
        <p className="text-stone-700 dark:text-stone-300">
          רק בעל המודעה יכול לגשת לחוזה השכירות
        </p>
        <Link href={`/listings/${id}`} className={btnSecondary}>
          חזרה למודעה
        </Link>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("he-IL");

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
        <Link href="/" className={breadcrumbLink}>דף הבית</Link>
        <ArrowRight className="h-3 w-3" />
        <Link href="/listings" className={breadcrumbLink}>מודעות</Link>
        <ArrowRight className="h-3 w-3" />
        <Link href={`/listings/${id}`} className={breadcrumbLink}>{listing.title}</Link>
        <ArrowRight className="h-3 w-3" />
        <span>חוזה שכירות</span>
      </div>

      {/* כותרת וכפתורים */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
          חוזה שכירות
        </h1>
        <ContractActions listingTitle={listing.title} />
      </div>

      {/* תוכן החוזה */}
      <div 
        id="contract-content"
        className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-sm dark:border-stone-700/80 dark:bg-stone-900 print:border-0 print:shadow-none"
      >
        <div className="contract-page space-y-6">
          
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">חוזה שכירות דירה</h1>
            <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-300">
              לחג השבועות תשפ״ו • גבעת זאב
            </h2>
          </div>

          <div className="text-sm leading-relaxed space-y-4">
            
            <p>
              <strong>תאריך החוזה:</strong> {today}
            </p>

            <div className="details-grid grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="space-y-2">
                <h3 className="font-bold text-base border-b border-stone-300 pb-1">פרטי המשכיר</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>שם:</strong> ____________________</p>
                  <p><strong>תעודת זהות:</strong> ____________________</p>
                  <p><strong>כתובת:</strong> ____________________</p>
                  <p><strong>טלפון:</strong> {listing.contactPhone}</p>
                  {listing.contactWhatsapp && (
                    <p><strong>וואטסאפ:</strong> {listing.contactWhatsapp}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-base border-b border-stone-300 pb-1">פרטי השוכר</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>שם:</strong> ____________________</p>
                  <p><strong>תעודת זהות:</strong> ____________________</p>
                  <p><strong>כתובת:</strong> ____________________</p>
                  <p><strong>טלפון:</strong> ____________________</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base border-b border-stone-300 pb-1">פרטי הנכס</h3>
              <div className="text-sm space-y-1">
                <p><strong>כתובת הנכס:</strong> {listing.address || "____________________"}, גבעת זאב</p>
                {listing.floor != null && (
                  <p><strong>קומה:</strong> {listing.floor === 0 ? "קרקע" : listing.floor}</p>
                )}
                <p><strong>מספר חדרים:</strong> {listing.rooms}</p>
                {listing.roomsClosed != null && (
                  <p><strong>חדרים סגורים:</strong> {listing.roomsClosed}</p>
                )}
                <p><strong>מרחק מבית הכנסת:</strong> {walkDistanceLabel(listing.walkDistance)}</p>
                {listing.code && (
                  <p><strong>קוד מודעה:</strong> #{listing.code}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base border-b border-stone-300 pb-1">תקופת השכירות</h3>
              <p className="text-sm">
                <strong>מתאריך:</strong> {listing.availableFrom.toLocaleDateString("he-IL")} <br/>
                <strong>עד תאריך:</strong> {listing.availableTo.toLocaleDateString("he-IL")}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base border-b border-stone-300 pb-1">דמי שכירות</h3>
              <div className="text-sm space-y-1">
                {listing.askingPriceNis && (
                  <p><strong>דמי שכירות לתקופה:</strong> {listing.askingPriceNis.toLocaleString("he-IL")} ₪</p>
                )}
                <p><strong>פיקדון ביטחון:</strong> ______________ ₪</p>
                <p><strong>אופן תשלום:</strong> ______________</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base border-b border-stone-300 pb-1">ציוד וריהוט הכלול במחיר</h3>
              <div className="text-xs grid grid-cols-2 gap-2">
                {(listing.bedsDouble ?? 0) > 0 && <p>✓ מיטות כפולות: {listing.bedsDouble}</p>}
                {(listing.bedsJewish ?? 0) > 0 && <p>✓ מיטות יהודיות: {listing.bedsJewish}</p>}
                {(listing.mattresses ?? 0) > 0 && <p>✓ מזרונים: {listing.mattresses}</p>}
                {(listing.cribs ?? 0) > 0 && <p>✓ עריסות: {listing.cribs}</p>}
                {listing.sofa && <p>✓ ספה נפתחת</p>}
                {listing.bedLinens && <p>✓ מצעים</p>}
                {listing.ac && <p>✓ מזגן</p>}
                {listing.shabbatPlate && <p>✓ פלטה לשבת</p>}
                {listing.shabbatUrnBoiler && <p>✓ מיחם שבת</p>}
                {listing.shabbatClock && <p>✓ שעון שבת</p>}
                {listing.kosherKitchen && <p>✓ מטבח כשר</p>}
                {listing.chairsCount && <p>✓ כסאות: {listing.chairsCount}</p>}
                {listing.bathrooms && <p>✓ שירותים/מקלחות: {listing.bathrooms}</p>}
                {listing.balconyType && <p>✓ {listing.balconyType} {listing.balconySize && `(${listing.balconySize})`}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-base border-b border-stone-300 pb-1">תנאים כלליים</h3>
              <div className="text-sm space-y-2 leading-relaxed">
                <p>1. השוכר מתחייב לשמור על הנכס במצב תקין ולהחזירו באותו מצב בו קיבלו.</p>
                <p>2. השוכר אחראי לניקיון הנכס במהלך תקופת השכירות ובסיומה.</p>
                <p>3. השוכר מתחייב לא לעשן בנכס ולא לערוך אירועים רועשים.</p>
                <p>4. השוכר מתחייב לכבד את שכני המקום ולא להפריע להם.</p>
                <p>5. אין להכניס בעלי חיים לנכס ללא אישור מראש בכתב מהמשכיר.</p>
                <p>6. השוכר אחראי על כל נזק שייגרם לנכס במהלך תקופת השכירות.</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-base border-b border-stone-300 pb-1">סעיף ביטול מיוחד</h3>
              <div className="text-sm bg-amber-50 p-3 rounded-lg border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/40">
                <p className="font-semibold mb-2">סעיף ביטול בגין מצב או הוראת האדמו״ר שליט״א:</p>
                <p>
                  במידה ויתעורר מצב חירום, מלחמה, או הוראה מפורשת מהאדמו״ר שליט״א המונעת הגעה או שהייה בגבעת זאב, 
                  השכירות תתבטל באופן מיידי ללא תשלום נוסף מצד השוכר. במקרה זה, המשכיר יחזיר לשוכר את מלוא הסכום ששולם 
                  או חלק יחסי בהתאם לתקופה שלא נוצלה.
                </p>
              </div>
            </div>

            <div className="signature-area flex justify-between items-end mt-12 pt-8 border-t border-stone-300">
              <div className="signature-box text-center space-y-3">
                <div className="border-b border-stone-400 w-48 h-16"></div>
                <div className="text-sm">
                  <p className="font-semibold">חתימת המשכיר</p>
                  <p>תאריך: _____________</p>
                </div>
              </div>

              <div className="signature-box text-center space-y-3">
                <div className="border-b border-stone-400 w-48 h-16"></div>
                <div className="text-sm">
                  <p className="font-semibold">חתימת השוכר</p>
                  <p>תאריך: _____________</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* כפתור חזרה */}
      <div className="text-center">
        <Link href={`/listings/${id}`} className={btnSecondary}>
          חזרה למודעה
        </Link>
      </div>
    </div>
  );
}