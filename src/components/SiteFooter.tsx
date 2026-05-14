"use client";

import { Mail } from "lucide-react";

export function SiteFooter() {
  // טשטוש קל של כתובת המייל מסקריפטים אוטומטיים
  const user = "me7656562";
  const domain = "gmail.com";
  const subject = encodeURIComponent("הערה לאתר דירות גבעת זאב");

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = `mailto:${user}@${domain}?subject=${subject}`;
  }

  return (
    <footer className="mt-10 border-t border-stone-200/70 bg-stone-50/60 px-4 py-6 text-center text-xs leading-relaxed text-stone-600 dark:border-stone-800/70 dark:bg-stone-950/40 dark:text-stone-400">
      <div className="mx-auto max-w-2xl space-y-3">
        <p>
          האתר נבנה במטרה להקל ולייעל בלבד. על השוכר / משכיר לוודא באופן עצמאי
          שהמידע המפורסם נכון והמחיר תואם את התקנון.
        </p>
        <p>
          פניות / הערות / הארות ניתן לשלוח{" "}
          <a
            href="#"
            onClick={handleClick}
            className="inline-flex items-center gap-1 font-semibold text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
          >
            <Mail className="h-3.5 w-3.5" />
            כאן
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
