"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Home, List, PlusCircle, Calculator, FileText, LogIn, LogOut } from "lucide-react";
import { btnSecondary } from "@/lib/uiStyles";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (pathname: string) => boolean;
};

const nav: NavItem[] = [
  { href: "/", label: "בית", icon: <Home className="h-3.5 w-3.5" /> },
  {
    href: "/listings",
    label: "מודעות",
    icon: <List className="h-3.5 w-3.5" />,
    match: (p) => p === "/listings" || (p.startsWith("/listings/") && !p.startsWith("/listings/new")),
  },
  { href: "/listings/new", label: "פרסום", icon: <PlusCircle className="h-3.5 w-3.5" />, match: (p) => p.startsWith("/listings/new") },
  { href: "/simulator", label: "סימולטור", icon: <Calculator className="h-3.5 w-3.5" /> },
  { href: "/tekannon", label: "תקנון", icon: <FileText className="h-3.5 w-3.5" /> },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.match) return item.match(pathname);
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function SiteNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/85 shadow-sm shadow-stone-200/30 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/90 dark:shadow-black/40">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-start">
          <Link
            href="/"
            className="group flex flex-col gap-0.5 rounded-lg py-0.5 focus-visible:outline-offset-4"
          >
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-teal-700/90 dark:text-teal-400/90">
              שבועות תשפ״ו
            </span>
            <span className="text-base font-bold tracking-tight text-stone-900 transition group-hover:text-teal-800 dark:text-stone-50 dark:group-hover:text-teal-300">
              דירות לחג
            </span>
          </Link>
        </div>

        <nav className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2" aria-label="ניווט ראשי">
          {nav.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-teal-700 text-white shadow-sm dark:bg-teal-600"
                    : "text-stone-600 hover:bg-stone-200/80 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2 border-t border-stone-200/60 pt-2 sm:border-t-0 sm:pt-0 dark:border-stone-700/60">
          {status === "loading" ? (
            <span className="text-xs text-stone-500">טוען…</span>
          ) : session?.user ? (
            <>
              <span className="max-w-[10rem] truncate text-xs text-stone-600 dark:text-stone-400" title={session.user.email ?? ""}>
                {session.user.name ?? session.user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`${btnSecondary} !px-3 !py-1.5 text-xs inline-flex items-center gap-1.5`}
              >
                <LogOut className="h-3.5 w-3.5" />
                יציאה
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: pathname || "/" })}
              className={`${btnSecondary} inline-flex items-center gap-1.5 !border-teal-200 !bg-teal-50 !px-3 !py-1.5 text-xs font-semibold !text-teal-900 hover:!bg-teal-100 dark:!border-teal-800 dark:!bg-teal-950/50 dark:!text-teal-100`}
            >
              <LogIn className="h-3.5 w-3.5" />
              התחברות עם Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
