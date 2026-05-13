/** מחלקות Tailwind משותפות לעקביות ויזואלית */

export const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-stone-600 dark:bg-stone-900/90 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/25";

export const textareaClass = `${inputClass} min-h-[120px] resize-y`;

export const selectClass = inputClass;

export const labelClass = "mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-200";

export const hintClass = "mt-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400";

export const cardClass =
  "rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-sm shadow-stone-200/40 backdrop-blur-sm dark:border-stone-700/80 dark:bg-stone-900/80 dark:shadow-black/20";

export const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-700/25 transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500";

export const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700";

export const breadcrumbLink =
  "text-sm text-teal-800 underline-offset-4 hover:text-teal-950 hover:underline dark:text-teal-300 dark:hover:text-teal-200";
