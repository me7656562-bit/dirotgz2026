"use client";

import { useMemo, useState } from "react";
import { SYNAGOGUE_ADDRESS_HE } from "@/lib/synagogue";
import {
  type WalkDistance,
  clampInt,
  computeShavuot5786Total,
} from "@/lib/pricing/shavuot5786StolinKarlin";
import { cardClass, hintClass, inputClass, labelClass } from "@/lib/uiStyles";

const distanceLabels: { id: WalkDistance; label: string }[] = [
  { id: "upTo10", label: "עד 10 דקות הליכה מבית הכנסת" },
  { id: "upTo20", label: "עד 20 דקות הליכה מבית הכנסת" },
  { id: "over20", label: "יותר מ-20 דקות הליכה מבית הכנסת" },
];

type SimulatorInitial = {
  initialBeds?: number;
  initialRooms?: number;
  initialDistance?: WalkDistance;
};

export function ShavuotSimulator({
  initialBeds,
  initialRooms,
  initialDistance,
}: SimulatorInitial = {}) {
  const [beds, setBeds] = useState(() => clampInt(initialBeds ?? 4, 2, 15));
  const [rooms, setRooms] = useState(() => clampInt(initialRooms ?? 3, 1, 30));
  const [distance, setDistance] = useState<WalkDistance>(() => {
    if (initialDistance === "upTo10" || initialDistance === "upTo20" || initialDistance === "over20") {
      return initialDistance;
    }
    return "upTo10";
  });
  const [missingBasic, setMissingBasic] = useState(false);
  const [noAc, setNoAc] = useState(false);
  const [landlordM, setLandlordM] = useState(0);
  const [renterM, setRenterM] = useState(0);

  const result = useMemo(
    () =>
      computeShavuot5786Total(beds, distance, rooms, {
        missingBasicItem: missingBasic,
        notFullAirConditioning: noAc,
        landlordMattresses: landlordM,
        renterMattresses: renterM,
      }),
    [beds, distance, rooms, missingBasic, noAc, landlordM, renterM]
  );

  return (
    <div className={`space-y-8 ${cardClass}`}>
      <div className="space-y-3">
        <label className={`${labelClass} mb-0`}>מרחק מבית הכנסת</label>
        <p className={hintClass}>{SYNAGOGUE_ADDRESS_HE}</p>
        <div className="mt-2 flex flex-col gap-2.5">
          {distanceLabels.map((d) => (
            <label
              key={d.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                distance === d.id
                  ? "border-teal-500 bg-teal-50/90 shadow-sm ring-2 ring-teal-500/20 dark:border-teal-500 dark:bg-teal-950/40 dark:ring-teal-400/25"
                  : "border-stone-200 bg-white hover:border-stone-300 dark:border-stone-600 dark:bg-stone-900/50 dark:hover:border-stone-500"
              }`}
            >
              <input
                type="radio"
                name="dist"
                checked={distance === d.id}
                onChange={() => setDistance(d.id)}
                className="size-4 accent-teal-600"
              />
              <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>מספר חדרים (כולל סלון)</label>
          <p className={hintClass}>
            בטבלה: עד 3 · עד 4 · <strong className="font-semibold text-stone-700 dark:text-stone-200">5 ומעלה (כולל 5)</strong>
          </p>
          <input
            type="number"
            min={1}
            max={20}
            value={rooms}
            onChange={(e) => setRooms(clampInt(Number(e.target.value), 1, 20))}
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass}>מספר מיטות (2–15)</label>
          <input
            type="number"
            min={2}
            max={15}
            value={beds}
            onChange={(e) => setBeds(clampInt(Number(e.target.value), 2, 15))}
            className={`${inputClass} mt-1`}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-5 dark:border-stone-700/80 dark:bg-stone-800/40">
        <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
          לפי התקנון: חדר הוא חלל שניתן לשכן בנוחות לפחות שתי מיטות; מיטה שאינה נוחה למבוגר נחשבת מזרון לעניין המחיר.
        </p>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg py-1 text-sm text-stone-800 dark:text-stone-200">
          <input
            type="checkbox"
            checked={missingBasic}
            onChange={(e) => setMissingBasic(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-teal-600"
          />
          <span>חסר פריט ציוד בסיסי (מקרר, שולחן, כיסאות וכו׳) — הנחה 100 ₪</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg py-1 text-sm text-stone-800 dark:text-stone-200">
          <input
            type="checkbox"
            checked={noAc}
            onChange={(e) => setNoAc(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-teal-600"
          />
          <span>אין מיזוג אוויר בכל החדרים — הנחה 75 ₪</span>
        </label>
        <div className="grid grid-cols-2 gap-4 border-t border-stone-200/80 pt-4 dark:border-stone-700/80">
          <div>
            <label className={labelClass}>מזרונים מהמשכיר</label>
            <input
              type="number"
              min={0}
              max={20}
              value={landlordM}
              onChange={(e) => setLandlordM(clampInt(Number(e.target.value), 0, 20))}
              className={`${inputClass} mt-1`}
            />
            <span className={hintClass}>+100 ₪ לכל אחד</span>
          </div>
          <div>
            <label className={labelClass}>מזרונים שהשוכר מביא</label>
            <input
              type="number"
              min={0}
              max={20}
              value={renterM}
              onChange={(e) => setRenterM(clampInt(Number(e.target.value), 0, 20))}
              className={`${inputClass} mt-1`}
            />
            <span className={hintClass}>+50 ₪ לכל אחד</span>
          </div>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <ul className="list-inside list-disc rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          {result.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      <div className="space-y-3 rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/90 to-stone-50/50 p-5 dark:border-teal-800/50 dark:from-teal-950/40 dark:to-stone-900/30">
        <h3 className="text-sm font-bold text-teal-950 dark:text-teal-100">פירוט מחיר</h3>
        <ul className="space-y-2 text-sm">
          {result.lines.map((line) => (
            <li key={line.label} className="flex justify-between gap-4 border-b border-teal-100/80 pb-2 last:border-0 dark:border-teal-900/30">
              <span className="text-stone-700 dark:text-stone-300">{line.label}</span>
              <span className="shrink-0 tabular-nums font-medium text-stone-900 dark:text-stone-50">
                {line.amount > 0 ? "+" : ""}
                {line.amount.toLocaleString("he-IL")} ₪
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-teal-200/80 pt-3 text-lg font-bold text-teal-950 dark:border-teal-800/60 dark:text-teal-50">
          <span>סה״כ מוצע</span>
          <span className="tabular-nums">{result.total.toLocaleString("he-IL")} ₪</span>
        </div>
      </div>
    </div>
  );
}
