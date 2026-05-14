import Link from "next/link";

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

          <p className="mx-auto mt-4 max-w-sm text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400 tiny:text-sm">
            לוח לפרסום וחיפוש דירות לפי תעריפי התקנון
          </p>
        </div>

        {/* כפתורים ראשיים */}
        <div className="grid grid-cols-2 gap-3 tiny:gap-2">
          <Link href="/listings"
            className="group flex flex-col items-center gap-2 rounded-3xl border-2 border-teal-200 bg-white px-4 py-5 tiny:px-3 tiny:py-4 font-bold text-teal-800 shadow-md shadow-teal-100/60 transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lg active:scale-95 dark:border-teal-800/60 dark:bg-stone-900 dark:text-teal-300">
            <span className="text-4xl tiny:text-5xl transition group-hover:scale-110">🏠</span>
            <span className="text-sm tiny:text-xs">מודעות דירות</span>
          </Link>

          <Link href="/listings/new"
            className="group flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 px-4 py-5 tiny:px-3 tiny:py-4 font-bold text-white shadow-md shadow-teal-400/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/30 active:scale-95">
            <span className="text-4xl tiny:text-5xl transition group-hover:scale-110">📋</span>
            <span className="text-sm tiny:text-xs">פרסם מודעה</span>
          </Link>

          <Link href="/simulator"
            className="group flex flex-col items-center gap-2 rounded-3xl border-2 border-amber-200 bg-white px-4 py-5 tiny:px-3 tiny:py-4 font-bold text-amber-800 shadow-md shadow-amber-100/60 transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg active:scale-95 dark:border-amber-800/60 dark:bg-stone-900 dark:text-amber-300">
            <span className="text-4xl tiny:text-5xl transition group-hover:scale-110">🧮</span>
            <span className="text-sm tiny:text-xs">סימולטור מחיר</span>
          </Link>

          <Link href="/tekannon"
            className="group flex flex-col items-center gap-2 rounded-3xl border-2 border-purple-200 bg-white px-4 py-5 tiny:px-3 tiny:py-4 font-bold text-purple-800 shadow-md shadow-purple-100/60 transition hover:-translate-y-0.5 hover:border-purple-400 hover:shadow-lg active:scale-95 dark:border-purple-800/60 dark:bg-stone-900 dark:text-purple-300">
            <span className="text-4xl tiny:text-5xl transition group-hover:scale-110">📜</span>
            <span className="text-sm tiny:text-xs">תקנון המרכז</span>
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


      </main>
    </div>
  );
}
