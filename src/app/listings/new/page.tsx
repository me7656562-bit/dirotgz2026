import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { NewListingForm } from "@/components/NewListingForm";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import { breadcrumbLink } from "@/lib/uiStyles";

export const metadata = {
  title: "פרסום מודעה",
  description: "פרסום דירה להשכרה לחג",
};

export default async function NewListingPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent("/listings/new")}`);
  }

  return (
    <div className="px-4 pb-16 pt-8 sm:pt-10">
      <div className="mx-auto max-w-xl space-y-8">
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
        </nav>

        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">פרסום מודעה</h1>
          <p className="max-w-prose text-pretty leading-relaxed text-stone-600 dark:text-stone-400">
            לאחר השליחה תועברו לדף המודעה. קטגוריית המרחק היא לפי הליכה מבית הכנסת:{" "}
            <span className="font-medium text-stone-800 dark:text-stone-200">{SYNAGOGUE_ADDRESS_HE}</span>.
          </p>
          {session?.user?.email ? (
            <p className="rounded-xl border border-teal-200/80 bg-teal-50/80 px-3 py-2 text-sm text-teal-950 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-100">
              מחוברים כ־<span className="font-medium">{session.user.email}</span> — ניתן לפרסם.
            </p>
          ) : null}
        </header>

        <NewListingForm />

        <p className="text-center">
          <Link href="/listings" className={`${breadcrumbLink} text-base`}>
            חזרה לרשימת המודעות
          </Link>
        </p>
      </div>
    </div>
  );
}
