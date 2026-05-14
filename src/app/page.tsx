import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-stone-50 dark:from-teal-950/40 dark:via-stone-950 dark:to-stone-950">
      <main className="mx-auto max-w-lg px-4 pb-20 pt-10 text-center">

        {/* Hero */}
        <div className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-teal-100 to-cyan-100 px-5 py-2 text-sm font-bold text-teal-800 shadow-sm ring-1 ring-teal-200 dark:from-teal-900/60 dark:to-cyan-900/40 dark:text-teal-200 dark:ring-teal-700">
            🕍 קהילת סטאלין קארלין · שבועות תשפ״ו
          </div>

          <h1 className="text-balance bg-gradient-to-l from-teal-700 to-cyan-600 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl dark:from-teal-300 dark:to-cyan-300">
            דירות להשכרה<br />לשבועות
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400">
            לוח מודעות פנימי וסימולציית מחיר לפי תקנון המרכז
          </p>
        </div>

        {/* כפתורים ראשיים */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/listings"
            className="group flex flex-col items-center gap-2 rounded-3xl border-2 border-teal-200 bg-white px-4 py-5 font-bold text-teal-800 shadow-md shadow-teal-100/60 transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lg dark:border-teal-800/60 dark:bg-stone-900 dark:text-teal-300">
            <span className="text-4xl transition group-hover:scale-110">🏠</span>
            <span className="text-sm">מודעות דירות</span>
          </Link>

          <Link href="/listings/new"
            className="group flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 px-4 py-5 font-bold text-white shadow-md shadow-teal-400/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30">
            <span className="text-4xl transition group-hover:scale-110">📋</span>
            <span className="text-sm">פרסם מודעה</span>
          </Link>

          <Link href="/simulator"
            className="group flex flex-col items-center gap-2 rounded-3xl border-2 border-amber-200 bg-white px-4 py-5 font-bold text-amber-800 shadow-md shadow-amber-100/60 transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg dark:border-amber-800/60 dark:bg-stone-900 dark:text-amber-300">
            <span className="text-4xl transition group-hover:scale-110">🧮</span>
            <span className="text-sm">סימולציית מחיר</span>
          </Link>

          <Link href="/tekannon"
            className="group flex flex-col items-center gap-2 rounded-3xl border-2 border-purple-200 bg-white px-4 py-5 font-bold text-purple-800 shadow-md shadow-purple-100/60 transition hover:-translate-y-0.5 hover:border-purple-400 hover:shadow-lg dark:border-purple-800/60 dark:bg-stone-900 dark:text-purple-300">
            <span className="text-4xl transition group-hover:scale-110">📜</span>
            <span className="text-sm">תקנון המרכז</span>
          </Link>
        </div>

        {/* הסבר קצר */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-stone-500 dark:text-stone-400">
          <div className="rounded-2xl bg-white/70 p-3 shadow-sm dark:bg-stone-900/50">
            <div className="text-2xl">🔐</div>
            <p className="mt-1 font-medium">כניסה עם Google</p>
            <p>לפרסום מודעה</p>
          </div>
          <div className="rounded-2xl bg-white/70 p-3 shadow-sm dark:bg-stone-900/50">
            <div className="text-2xl">💰</div>
            <p className="mt-1 font-medium">מחיר לפי תקנון</p>
            <p>חישוב אוטומטי</p>
          </div>
          <div className="rounded-2xl bg-white/70 p-3 shadow-sm dark:bg-stone-900/50">
            <div className="text-2xl">🗺️</div>
            <p className="mt-1 font-medium">מרחק הליכה</p>
            <p>מבית הכנסת</p>
          </div>
        </div>

        {/* פרטי קשר */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200/80 bg-white/70 text-right shadow-sm dark:border-stone-700/80 dark:bg-stone-900/50">
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            <div className="flex items-start gap-3 p-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <div className="text-sm">
                <p className="font-bold text-stone-800 dark:text-stone-200">בית הכנסת (נקודת ייחוס)</p>
                <p className="mt-0.5 text-stone-500 dark:text-stone-400">{SYNAGOGUE_ADDRESS_HE}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
              <div className="text-sm">
                <p className="font-bold text-stone-800 dark:text-stone-200">משרד המרכז</p>
                <p className="mt-0.5 text-stone-500 dark:text-stone-400">02-5917711 · merkaz.s.k@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
