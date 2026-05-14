"use client";

import { useMemo, useState } from "react";
import {
  type WalkDistance,
  clampInt,
  computeShavuot5786Total,
} from "@/lib/pricing/shavuot5786StolinKarlin";

type SimulatorInitial = {
  initialBeds?: number;
  initialRooms?: number;
  initialDistance?: WalkDistance;
};

function Num({
  label, value, onChange, min = 0, max = 30,
}: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-stone-200 bg-white font-bold text-stone-700 hover:border-teal-400 hover:text-teal-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">−</button>
        <span className="w-8 text-center text-lg font-black tabular-nums text-stone-900 dark:text-stone-50">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-stone-200 bg-white font-bold text-stone-700 hover:border-teal-400 hover:text-teal-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">+</button>
      </div>
    </div>
  );
}

const distOpts: { id: WalkDistance; label: string; emoji: string; color: string; active: string }[] = [
  { id: "upTo10", label: "עד 10 דק'", emoji: "🟢", color: "border-stone-200 dark:border-stone-700", active: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" },
  { id: "upTo20", label: "עד 20 דק'", emoji: "🟡", color: "border-stone-200 dark:border-stone-700", active: "border-amber-500 bg-amber-50 dark:bg-amber-950/40" },
  { id: "over20", label: "מעל 20", emoji: "🔴", color: "border-stone-200 dark:border-stone-700", active: "border-rose-500 bg-rose-50 dark:bg-rose-950/40" },
];

export function ShavuotSimulator({ initialBeds, initialRooms, initialDistance }: SimulatorInitial = {}) {
  const [beds, setBeds] = useState(() => clampInt(initialBeds ?? 4, 2, 15));
  const [rooms, setRooms] = useState(() => clampInt(initialRooms ?? 3, 1, 30));
  const [distance, setDistance] = useState<WalkDistance>(
    initialDistance === "upTo10" || initialDistance === "upTo20" || initialDistance === "over20"
      ? initialDistance : "upTo10"
  );
  const [missingBasic, setMissingBasic] = useState(false);
  const [noAc, setNoAc] = useState(false);
  const [landlordM, setLandlordM] = useState(0);
  const [renterM, setRenterM] = useState(0);

  const result = useMemo(
    () => computeShavuot5786Total(beds, distance, rooms, {
      missingBasicItem: missingBasic,
      notFullAirConditioning: noAc,
      landlordMattresses: landlordM,
      renterMattresses: renterM,
    }),
    [beds, distance, rooms, missingBasic, noAc, landlordM, renterM]
  );

  return (
    <div className="mx-auto max-w-sm space-y-4">

      {/* מרחק */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-teal-600 to-cyan-600 px-5 py-2.5">
          <p className="text-sm font-bold text-white">📍 מרחק מבית הכנסת</p>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4">
          {distOpts.map((d) => (
            <label key={d.id} className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 py-3 transition ${distance === d.id ? d.active : d.color}`}>
              <input type="radio" checked={distance === d.id} onChange={() => setDistance(d.id)} className="sr-only" />
              <span className="text-2xl">{d.emoji}</span>
              <span className="mt-1 text-xs font-bold text-stone-700 dark:text-stone-200">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* חדרים ומיטות */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-blue-600 to-indigo-600 px-5 py-2.5">
          <p className="text-sm font-bold text-white">🛏️ חדרים ומיטות</p>
        </div>
        <div className="space-y-3 p-4">
          <Num label="חדרים (כולל סלון)" value={rooms} onChange={setRooms} min={1} max={20} />
          <Num label="מספר מיטות (2–15)" value={beds} onChange={setBeds} min={2} max={15} />
        </div>
      </div>

      {/* התאמות */}
      <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm dark:border-stone-700/80 dark:bg-stone-900">
        <div className="bg-gradient-to-l from-purple-600 to-pink-600 px-5 py-2.5">
          <p className="text-sm font-bold text-white">⚙️ התאמות</p>
        </div>
        <div className="space-y-3 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-stone-100 px-3 py-2.5 dark:border-stone-800">
            <span className="text-sm text-stone-700 dark:text-stone-300">חסר ציוד בסיסי (−100 ₪)</span>
            <input type="checkbox" checked={missingBasic} onChange={(e) => setMissingBasic(e.target.checked)}
              className="h-4 w-4 accent-teal-600" />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-stone-100 px-3 py-2.5 dark:border-stone-800">
            <span className="text-sm text-stone-700 dark:text-stone-300">ללא מזגן בכל החדרים (−75 ₪)</span>
            <input type="checkbox" checked={noAc} onChange={(e) => setNoAc(e.target.checked)}
              className="h-4 w-4 accent-teal-600" />
          </label>
          <Num label="מזרונים מהמשכיר (+100 ₪)" value={landlordM} onChange={setLandlordM} max={20} />
          <Num label="מזרונים מהשוכר (+50 ₪)" value={renterM} onChange={setRenterM} max={20} />
        </div>
      </div>

      {/* תוצאה */}
      {result.warnings.length > 0 && (
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {result.warnings.map((w) => <p key={w}>⚠️ {w}</p>)}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-teal-300/70 shadow-lg shadow-teal-200/40 dark:border-teal-700/50">
        <div className="space-y-1.5 bg-white p-4 dark:bg-stone-900">
          {result.lines.map((line) => (
            <div key={line.label} className="flex justify-between gap-3 text-sm">
              <span className="text-stone-600 dark:text-stone-400">{line.label}</span>
              <span className={`tabular-nums font-semibold ${line.amount < 0 ? "text-red-600" : "text-stone-800 dark:text-stone-100"}`}>
                {line.amount > 0 ? "+" : ""}{line.amount.toLocaleString("he-IL")} ₪
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between bg-gradient-to-l from-teal-500 to-emerald-500 px-5 py-4">
          <span className="text-lg font-bold text-white">סה״כ מוצע</span>
          <span className="text-3xl font-black tabular-nums text-white">
            {result.total.toLocaleString("he-IL")} ₪
          </span>
        </div>
      </div>
    </div>
  );
}
