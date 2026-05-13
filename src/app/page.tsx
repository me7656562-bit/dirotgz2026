import Link from "next/link";
import { Home, PlusCircle, Calculator, FileText, MapPin, Phone } from "lucide-react";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import { btnPrimary, btnSecondary } from "@/lib/uiStyles";

export default function HomePage() {
  return (
    <div className="px-4 pb-20 pt-12 sm:pt-16">
      <main className="mx-auto max-w-lg text-center">

        {/* כותרת */}
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-800 ring-1 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:ring-teal-800">
            🕍 קהילת סטאלין קארלין · שבועות תשפ״ו
          </div>
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
            דירות להשכרה לחגים
          </h1>
          <p className="mx-auto max-w-md text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400">
            לוח מודעות פנימי וסימולציית מחיר לפי תקנון המרכז — הכול במקום אחד, בשפה נוחה.
          </p>
          <p className="text-sm text-stone-400 dark:text-stone-500">
            פרסום מודעה דורש התחברות עם Google (כפתור למעלה)
          </p>
        </div>

        {/* כפתורים */}
        <div className="mx-auto grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href="/listings" className={`${btnSecondary} gap-2 py-3.5`}>
            <Home className="h-4 w-4" />
            מודעות דירות
          </Link>
          <Link href="/listings/new" className={`${btnPrimary} gap-2 py-3.5`}>
            <PlusCircle className="h-4 w-4" />
            פרסום מודעה
          </Link>
          <Link href="/simulator" className={`${btnSecondary} gap-2 py-3.5`}>
            <Calculator className="h-4 w-4" />
            סימולציית מחיר
          </Link>
          <Link href="/tekannon" className={`${btnSecondary} gap-2 py-3.5`}>
            <FileText className="h-4 w-4" />
            תקנון (סריקה)
          </Link>
        </div>

        {/* פרטי קשר */}
        <div className="mx-auto mt-14 max-w-md divide-y divide-stone-200/80 rounded-2xl border border-stone-200/80 bg-white/70 text-right text-sm leading-relaxed text-stone-600 shadow-sm dark:divide-stone-700/80 dark:border-stone-700/80 dark:bg-stone-900/50 dark:text-stone-400">
          <div className="flex items-start gap-3 p-5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
            <div>
              <p className="font-semibold text-stone-800 dark:text-stone-200">בית הכנסת (נקודת ייחוס למרחק)</p>
              <p className="mt-0.5">{SYNAGOGUE_ADDRESS_HE}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-5">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
            <div>
              <p className="font-semibold text-stone-800 dark:text-stone-200">משרד המרכז (מתקנון)</p>
              <p className="mt-0.5">טל׳ 02-5917711 · merkaz.s.k@gmail.com</p>
              <p>רח׳ עזרא 24, ירושלים</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
