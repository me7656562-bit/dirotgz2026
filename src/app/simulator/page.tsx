import Link from "next/link";
import { ShavuotSimulator } from "@/components/ShavuotSimulator";
import { parseWalkDistance } from "@/lib/listingLabels";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import { clampInt } from "@/lib/pricing/shavuot5786StolinKarlin";
import { breadcrumbLink } from "@/lib/uiStyles";

export const metadata = {
  title: "סימולטור מחיר — שבועות תשפ״ו",
  description: "חישוב לפי תקנון מרכז סטאלין קארלין לחג השבועות תשפ״ו",
};

export default async function SimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ beds?: string; rooms?: string; distance?: string }>;
}) {
  const sp = await searchParams;
  const initialBeds = sp.beds !== undefined ? clampInt(Number(sp.beds), 2, 15) : undefined;
  const initialRooms = sp.rooms !== undefined ? clampInt(Number(sp.rooms), 1, 30) : undefined;
  const initialDistance = parseWalkDistance(sp.distance) ?? undefined;

  return (
    <div className="px-4 pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <nav className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
          <Link href="/" className={breadcrumbLink}>
            דף הבית
          </Link>
          <span className="text-stone-400" aria-hidden>
            ·
          </span>
          <Link href="/listings" className={breadcrumbLink}>
            מודעות
          </Link>
          <span className="text-stone-400" aria-hidden>
            ·
          </span>
          <Link href="/tekannon" className={breadcrumbLink}>
            תקנון מקורי
          </Link>
        </nav>

        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            סימולטור שכירות — חג השבועות תשפ״ו
          </h1>
          <p className="max-w-prose text-pretty leading-relaxed text-stone-600 dark:text-stone-400">
            החישוב מבוסס על טבלת המחירים וההתאמות שבתקנון מרכז סטאלין קארלין. זמני ההליכה בטבלה הם ביחס לבית הכנסת:{" "}
            <span className="font-medium text-stone-800 dark:text-stone-200">{SYNAGOGUE_ADDRESS_HE}</span>. יש לאמת מול
            המסמך הרשמי; האתר אינו מחייב משפטית.
          </p>
        </header>

        <ShavuotSimulator
          initialBeds={initialBeds}
          initialRooms={initialRooms}
          initialDistance={initialDistance}
        />
      </div>
    </div>
  );
}
