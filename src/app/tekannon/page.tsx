import Image from "next/image";
import Link from "next/link";
import { breadcrumbLink, cardClass } from "@/lib/uiStyles";

export const metadata = {
  title: "תקנון שכירות דירות — שבועות תשפ״ו",
  description: "תקנון מרכז סטאלין קארלין — סריקה",
};

export default function TekannonPage() {
  return (
    <div className="px-4 pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <nav className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
          <Link href="/" className={breadcrumbLink}>
            דף הבית
          </Link>
          <span className="text-stone-400" aria-hidden>
            ·
          </span>
          <Link href="/simulator" className={breadcrumbLink}>
            סימולציה
          </Link>
        </nav>

        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl dark:text-stone-50">
            תקנון שכירות דירות — חג השבועות תשפ״ו
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">סריקה רשמית · מרכז סטאלין קארלין</p>
        </header>

        <div className={`overflow-hidden ${cardClass} p-0`}>
          <Image
            src="/assets/tekannon-shavuot-5786.jpg"
            alt="תקנון שכירות דירות חג השבועות תשפ״ו — מרכז סטאלין קארלין"
            width={1200}
            height={1700}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}
